import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { Device, AppResponseType } from '@domain-data-models/app-domain.enums';

import { PrivateEventTokenDTO } from '@private-events-core/api/private-events.dto-models';
import { FormBuilder, Validators } from '@angular/forms';

import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  setPrivateEventName,
  setPrivateEventProfileImage,
  privateEventNameSelector,
  profileImageSelector,
  privateEventStartTimeSelector,
  privateEventEndTimeSelector,
  privateEventDateSelector,
} from '@app-core/private-events-core/store/create-edit-event';
import { FilePickerService, ProfileImageService } from '@media-core/services';
import { MediaDesignation } from '@media-core/data-models';

@Component({
  selector: 'Tsk-name-preview',
  templateUrl: './name-preview.component.html',
  styleUrls: ['./name-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NamePreviewComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public privateEventToken: PrivateEventTokenDTO = {} as PrivateEventTokenDTO;
  public nameForm = this.formBuilder.group({
    eventName: ['', Validators.required],
  });

  private eventName: string = null;
  private profileImage: File = null;
  private eventDate: string = null;
  private startTime: string = null;
  private endTime: string = null;

  private eventName$: Observable<string> = this.store.select(
    privateEventNameSelector
  );
  private profileImage$: Observable<File | string> =
    this.store.select(profileImageSelector);
  private eventDate$: Observable<string> = this.store.select(
    privateEventDateSelector
  );
  private startTime$: Observable<string> = this.store.select(
    privateEventStartTimeSelector
  );
  private endTime$: Observable<string> = this.store.select(
    privateEventEndTimeSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store<any>,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService,
    private profileImageService: ProfileImageService,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    this.nameForm.get('eventName')?.valueChanges.subscribe(eventName => {
      this.store.dispatch(setPrivateEventName({ eventName: eventName }));
    });

    const eventNameSub = this.eventName$.subscribe(eventName => {
      if (eventName !== null) {
        this.eventName = eventName;
        this.nameForm.get('eventName')?.setValue(eventName);
        this.privateEventToken = {
          ...this.privateEventToken,
          eventName: this.eventName,
        };
      }
    });

    this.subscriptions.add(eventNameSub);

    const profileImageSub = this.profileImage$.subscribe(profileImage => {
      if (profileImage) {
        this.profileImage = profileImage as File;
        this.profileImageService
          .readProfileImageFile(this.profileImage)
          .then(profileImageUrl => {
            this.privateEventToken = {
              ...this.privateEventToken,
              profileImage: profileImageUrl,
            };
          })
          .catch(error =>
            this.appResponseService.createAppResponse(AppResponseType.warning, [
              error,
            ])
          );
      }
    });

    this.subscriptions.add(profileImageSub);

    const eventDateSub = this.eventDate$.subscribe(eventDate => {
      if (eventDate) {
        this.eventDate = eventDate;
        this.privateEventToken = {
          ...this.privateEventToken,
          eventDate: this.eventDate,
        };
      }
    });

    this.subscriptions.add(eventDateSub);

    const startTimeSub = this.startTime$.subscribe(startTime => {
      if (startTime) {
        this.startTime = startTime;
        this.privateEventToken = {
          ...this.privateEventToken,
          startTime: this.startTime,
        };
      }
    });

    this.subscriptions.add(startTimeSub);

    const endTimeSub = this.endTime$.subscribe(endTime => {
      if (endTime) {
        this.endTime = endTime;
        this.privateEventToken = {
          ...this.privateEventToken,
          endTime: this.endTime,
        };
      }
    });

    this.subscriptions.add(endTimeSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async uploadProfileImage(): Promise<void> {
    const [profileImage] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImage) {
      return;
    }

    this.profileImage = profileImage;
    this.store.dispatch(
      setPrivateEventProfileImage({ profileImage: this.profileImage })
    );

    this.profileImageService
      .readProfileImageFile(this.profileImage)
      .then(profileImageUrl => {
        this.privateEventToken = {
          ...this.privateEventToken,
          profileImage: profileImageUrl,
        };
      })
      .catch(error =>
        this.appResponseService.createAppResponse(AppResponseType.warning, [
          error,
        ])
      );
  }
}
