import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PrivateEventConstants } from '@app-core/private-events-core/data-models';
import { createAppResponse } from '@core-modules';
import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';

import { BreakPointService } from '@domain-services/index';
import {
  privateEventInvitationSelector,
  privateEventNameSelector,
  profileImageSelector,
  updatePrivateEventDetails,
} from '@private-events-core/store/create-edit-event';
import { updateProfileImage } from '@media-core/store';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import { EventUpdateDTO } from '@private-events-core/api';

@Component({
  selector: 'Tsk-private-event-details',
  templateUrl: './private-event-details.component.html',
  styleUrls: ['./private-event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventDetailsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `${PrivateEventConstants.DEFAULT_PROFILE_IMAGE} center center / contain no-repeat`;
  public detailsForm: FormGroup = this.formBuilder.group({
    eventName: ['', Validators.required],
    eventInvitation: ['', Validators.required],
  });

  private profile: ProfileDTO;

  private eventInvitation$: Observable<string> = this.store.select(
    privateEventInvitationSelector
  );
  private eventName$: Observable<string> = this.store.select(
    privateEventNameSelector
  );
  private profileImage$: Observable<File | string> =
    this.store.select(profileImageSelector);
  private profile$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileSub = this.profile$.subscribe(
      profile => (this.profile = profile)
    );

    this.subscriptions.add(profileSub);

    const profileImageSub = this.profileImage$.subscribe(profileImage => {
      if (profileImage) {
        const imagePath: string = profileImage as string;
        this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
      }
    });

    this.subscriptions.add(profileImageSub);

    const eventNameSub = this.eventName$.subscribe(eventName => {
      if (eventName) {
        this.detailsForm.patchValue({ eventName: eventName });
      }
    });

    this.subscriptions.add(eventNameSub);

    const eventInvitationSub = this.eventInvitation$.subscribe(
      eventInvitation => {
        if (eventInvitation) {
          this.detailsForm.patchValue({ eventInvitation: eventInvitation });
        }
      }
    );

    this.subscriptions.add(eventInvitationSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async updateEventInvitationCard(): Promise<void> {
    const [profileImage] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImage) {
      return;
    }

    this.store.dispatch(
      updateProfileImage({
        profile: this.profile,
        profileImage: profileImage,
      })
    );
  }

  public updatePrivateEventDetails(): void {
    if (this.detailsForm.invalid) {
      const appResponse: AppResponse = {
        viewed: false,
        type: AppResponseType.error,
        messages: ['common-errors.required-fields'],
      };

      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    const privateEventDetailsForm = this.detailsForm.value;

    const eventUpdateDTO: EventUpdateDTO = {
      eventId: this.profile.profileId,
      eventName: privateEventDetailsForm.eventName,
      eventInvitation: privateEventDetailsForm.eventInvitation,
    };

    this.store.dispatch(
      updatePrivateEventDetails({ eventUpdateDTO: eventUpdateDTO })
    );
  }
}
