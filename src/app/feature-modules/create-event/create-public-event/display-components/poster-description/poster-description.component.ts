import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Observable, Subscription } from 'rxjs';
import {
  eventDescriptionSelector,
  eventMediaSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import { ProfileMediaFileDTO } from '@app-core/media-core';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import {
  setPublicEventDescription,
  updatePublicEventMedia,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';

@Component({
  selector: 'Tsk-poster-description',
  templateUrl: './poster-description.component.html',
  styleUrls: ['./poster-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PosterDescriptionComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public addMedia: string = 'add';
  public removeMedia: string = 'remove';
  public eventMediaList: any[] = [];
  public publicEventMedia: File[] = [];
  public selectedFiles: File[] = [];

  public descriptionForm = this.formBuilder.group({
    eventDescription: ['', Validators.required],
  });

  private eventMedia$: Observable<ProfileMediaFileDTO[] | File[]> =
    this.store.select(eventMediaSelector);
  private eventDescription$: Observable<string> = this.store.select(
    eventDescriptionSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private store: Store,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const eventMediaSub = this.eventMedia$.subscribe(eventMedia => {
      if (eventMedia) {
        this.publicEventMedia = eventMedia as File[];
        this.displayPublicEventMedia(this.publicEventMedia);
      }
    });

    this.subscriptions.add(eventMediaSub);

    const eventDescriptionSub = this.eventDescription$.subscribe(
      eventDescription => {
        if (eventDescription) {
          this.descriptionForm
            .get('eventDescription')
            ?.setValue(eventDescription);
        }
      }
    );

    this.subscriptions.add(eventDescriptionSub);

    const descriptionChangesSub = this.descriptionForm
      .get('eventDescription')
      ?.valueChanges.subscribe(eventDescription => {
        this.store.dispatch(
          setPublicEventDescription({ eventDescription: eventDescription })
        );
      });

    this.subscriptions.add(descriptionChangesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async uploadEventMediaFiles(): Promise<void> {
    const pickedFiles: File[] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_media
    );
    if (pickedFiles.length === 0) {
      return;
    }

    const currentMediaFiles = this.publicEventMedia;
    const mediaFiles: File[] = [];

    if (currentMediaFiles.length >= 1) {
      currentMediaFiles.forEach(file => mediaFiles.push(file));
    }

    pickedFiles.forEach((file: File) => {
      const duplicate: boolean = mediaFiles.some(
        mediaFile =>
          mediaFile.name === file.name &&
          mediaFile.type === file.type &&
          mediaFile.size === file.size
      );

      if (!duplicate) {
        mediaFiles.push(file);
      }
    });

    this.store.dispatch(updatePublicEventMedia({ eventMedia: mediaFiles }));
  }

  public selectImageFile(file: File): void {
    const selected: boolean = this.selectedFiles.includes(file);
    if (!selected) {
      this.selectedFiles.push(file);
    } else if (selected) {
      const selectedFiles: File[] = this.selectedFiles.filter(
        selectedFile => selectedFile !== file
      );
      this.selectedFiles = [...selectedFiles];
    }

    this.eventMediaList.forEach(mediaFile => {
      if (this.selectedFiles.includes(mediaFile.file)) {
        mediaFile.selected = true;
      } else {
        mediaFile.selected = false;
      }
    });
  }

  public updateUploadedMediaFiles(): void {
    const mediaFiles: File[] = [];
    this.publicEventMedia.forEach(mediaFile => {
      if (!this.selectedFiles.includes(mediaFile)) {
        mediaFiles.push(mediaFile);
      }
    });

    this.selectedFiles = [];
    this.store.dispatch(updatePublicEventMedia({ eventMedia: mediaFiles }));
  }

  private displayPublicEventMedia(uploadedFiles?: File[]): void {
    const eventMedia = uploadedFiles ? uploadedFiles : this.publicEventMedia;
    this.eventMediaList = [];

    if (eventMedia && eventMedia.length >= 1) {
      eventMedia.forEach(eventMediaFile => {
        const reader = new FileReader();
        reader.onload = file => {
          const filePath = file.target.result as string;
          const mediaFile: any = {
            file: eventMediaFile,
            filePath: filePath,
            selected: false,
          };
          this.eventMediaList.push(mediaFile);
        };

        reader.readAsDataURL(eventMediaFile);
      });
    }
  }
}
