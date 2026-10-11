import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import {
  setPrivateEventInvitation,
  updatePrivateEventMedia,
  privateEventInvitationSelector,
  privateEventMediaSelector,
} from '@app-core/private-events-core/store/create-edit-event';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';

interface MediaFiles {
  file: File;
  filePath: string;
  selected: boolean;
}

@Component({
  selector: 'Tsk-poster-invitation',
  templateUrl: './poster-invitation.component.html',
  styleUrls: ['./poster-invitation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PosterInvitationComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public controls: any = {
    add_media: 'add',
    remove_media: 'remove',
  };

  public mediaFiles: MediaFiles[] = [];
  public eventMedia: File[] = [];
  public selectedFiles: File[] = [];

  public invitationForm = this.formBuilder.group({
    eventInvitation: ['', Validators.required],
  });

  private eventMedia$: Observable<File[]> = this.store.select(
    privateEventMediaSelector
  );
  private eventInvitation$: Observable<string> = this.store.select(
    privateEventInvitationSelector
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
      this.eventMedia = [...eventMedia];
      this.displayMediaFiles(eventMedia);
    });

    this.subscriptions.add(eventMediaSub);

    const eventInvitationSub = this.eventInvitation$.subscribe(
      eventInvitation => {
        if (eventInvitation !== null) {
          this.invitationForm.get('eventInvitation')?.setValue(eventInvitation);
        }
      }
    );

    this.subscriptions.add(eventInvitationSub);

    const invitationChangesSub = this.invitationForm
      .get('eventInvitation')
      ?.valueChanges.subscribe(eventInvitation => {
        this.store.dispatch(
          setPrivateEventInvitation({ eventInvitation: eventInvitation })
        );
      });

    this.subscriptions.add(invitationChangesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async uploadPrivateEventMedia(): Promise<void> {
    const pickedFiles: File[] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_media
    );
    if (pickedFiles.length === 0) {
      return;
    }

    const currentMediaFiles = this.eventMedia;
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

    this.store.dispatch(updatePrivateEventMedia({ eventMedia: mediaFiles }));
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

    this.mediaFiles.forEach(mediaFile => {
      if (this.selectedFiles.includes(mediaFile.file)) {
        mediaFile.selected = true;
      } else {
        mediaFile.selected = false;
      }
    });
  }

  public updateUploadedMediaFiles(): void {
    const mediaFiles: File[] = [];
    this.eventMedia.forEach(mediaFile => {
      if (!this.selectedFiles.includes(mediaFile)) {
        mediaFiles.push(mediaFile);
      }
    });

    this.selectedFiles = [];
    this.store.dispatch(updatePrivateEventMedia({ eventMedia: mediaFiles }));
  }

  private displayMediaFiles(uploadedFiles?: File[]): void {
    const eventMedia = uploadedFiles ? uploadedFiles : this.eventMedia;
    this.mediaFiles = [];

    if (eventMedia && eventMedia.length >= 1) {
      eventMedia.forEach(eventMediaFile => {
        const reader = new FileReader();
        reader.onload = file => {
          const filePath = file.target.result as string;
          const mediaFile: MediaFiles = {
            file: eventMediaFile,
            filePath: filePath,
            selected: false,
          };
          this.mediaFiles.push(mediaFile);
        };

        reader.readAsDataURL(eventMediaFile);
      });
    }
  }
}
