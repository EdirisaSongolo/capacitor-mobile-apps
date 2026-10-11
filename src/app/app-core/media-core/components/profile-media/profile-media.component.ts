import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProfileDTO } from '@app-core/app-api';
import {
  CreateMediaDTO,
  MediaFilesDTO,
  ProfileMediaFileDTO,
} from '@media-core/api';
import {
  ComponentAction,
  DialogAction,
  Device,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { profileMediaSelector } from '@media-core/store/media-selectors';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import {
  createProfileMedia,
  removeProfileMedia,
  retrieveProfileMedia,
} from '@app-core/media-core/store';
import {
  componentActionSelector,
  profileDTOSelector,
} from '@app-domain/store/domain.selectors';

@Component({
  selector: 'Tsk-profile-media',
  templateUrl: './profile-media.component.html',
  styleUrls: ['./profile-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileMediaComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction;

  public controlIcons: any = {
    add: 'add',
    remove: 'remove',
  };

  public confirmationDialog: boolean = false;
  public deleteConfirmation = 'media.confirm-delete-action';

  public actionsOptions: typeof ComponentAction = ComponentAction;
  public profileMedia: ProfileMediaFileDTO[] = [];
  public selectedMediaFiles: ProfileMediaFileDTO[] = [];

  private profileDTO: ProfileDTO;

  private profileMedia$: Observable<ProfileMediaFileDTO[]> =
    this.store.select(profileMediaSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private componentAction$: Observable<ComponentAction> = this.store.select(
    componentActionSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileMediaSub = this.profileMedia$.subscribe(profileMedia => {
      if (profileMedia) {
        this.profileMedia = [...profileMedia];
      }
    });

    this.subscriptions.add(profileMediaSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(retrieveProfileMedia({ profile: this.profileDTO }));
      }
    });

    this.subscriptions.add(profileDTOSub);

    const componentActionSub = this.componentAction$.subscribe(
      componentAction => {
        if (componentAction) {
          this.componentAction = componentAction;
        }
      }
    );

    this.subscriptions.add(componentActionSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async createProfileMedia(): Promise<void> {
    const mediaFiles: File[] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_media
    );
    if (mediaFiles.length === 0) {
      return;
    }

    const createMedia: CreateMediaDTO = {
      profile: this.profileDTO.profile,
      profileId: this.profileDTO.profileId,
      mediaFiles: mediaFiles,
    };

    this.store.dispatch(createProfileMedia({ createMedia: createMedia }));
  }

  public selectMediaFile(mediaFile: ProfileMediaFileDTO): void {
    const mediaFileIndex = this.selectedMediaFiles.findIndex(
      selectedMedia => selectedMedia.mediaFileId === mediaFile.mediaFileId
    );

    if (mediaFileIndex === -1) {
      this.selectedMediaFiles.push(mediaFile);
    } else {
      this.selectedMediaFiles.splice(mediaFileIndex, 1);
    }
  }

  public deleteSelectedMedia(): void {
    this.confirmationDialog = true;
  }

  public propateDialogAction(dialogAction: DialogAction): void {
    if (dialogAction === DialogAction.cancelled) {
      this.confirmationDialog = false;
    } else if (dialogAction === DialogAction.confirmed) {
      this.removeSelectedMediaFiles();
      this.confirmationDialog = false;
      this.selectedMediaFiles = [];
    }
  }

  public removeSelectedMediaFiles(): void {
    const profileMedia: ProfileMediaFileDTO[] = [...this.selectedMediaFiles];
    const mediaFiles: MediaFilesDTO = {
      profile: this.profileDTO.profile,
      profileId: this.profileDTO.profileId,
      mediaFiles: profileMedia,
    };

    this.store.dispatch(removeProfileMedia({ mediaFiles: mediaFiles }));
  }
}
