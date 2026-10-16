import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';

import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  EventDetailsDTO,
  PublicEventTokenDTO,
} from '@app-core/public-events-core/api';
import {
  PublicEventConstants,
  PublicEventCategoriesList,
  PublicEventCategories,
} from '@public-events-core/data-models';
import {
  publicEventTokenSelector,
  updatePublicEventDetails,
} from '@app-core/public-events-core/store';
import { updateProfileImage } from '@media-core/store';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';

@Component({
  selector: 'Tsk-public-event-details',
  templateUrl: './public-event-details.component.html',
  styleUrls: ['./public-event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventDetailsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `${PublicEventConstants.DEFAULT_PROFILE_IMAGE} center / contain no-repeat`;
  public publicEventTokenDTO: PublicEventTokenDTO;

  public publicEventCategory: string;
  public eventCategoriesList: string[][] = [
    [PublicEventConstants.SELECT_CATEGORY, 'common.select-category'],
    ...Object.entries(PublicEventCategoriesList),
  ];

  public eventDetailsForm: FormGroup = this.formBuilder.group({
    eventCategory: ['', Validators.required],
    eventName: ['', Validators.required],
    eventDescription: ['', Validators.required],
  });

  private profile: ProfileDTO;

  private profileDTo$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private publicEventTokenDTO$: Observable<PublicEventTokenDTO> =
    this.store.select(publicEventTokenSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private translator: TranslateService,
    private appResponseService: AppResponseService,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTo$.subscribe(profile => {
      if (profile) {
        this.profile = { ...profile };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const publicEventTokenSub = this.publicEventTokenDTO$.subscribe(
      publicEventToken => {
        if (publicEventToken) {
          this.publicEventTokenDTO = { ...publicEventToken };
          this.processPublicEventToken();
        }
      }
    );

    this.subscriptions.add(publicEventTokenSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public eventCategorySelection(publicEventCategory: string): void {
    this.publicEventCategory = publicEventCategory;
    Object.entries(PublicEventCategories).forEach(([key, value]) => {
      if (key === publicEventCategory) {
        this.eventDetailsForm.patchValue({ eventCategory: value });
      }
    });
  }

  public async updatePublicEventPoster(): Promise<void> {
    const [profileImageFile] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImageFile) {
      return;
    }

    this.store.dispatch(
      updateProfileImage({
        profile: this.profile,
        profileImage: profileImageFile,
      })
    );
  }

  public updatePublicEventDetails(): void {
    if (this.eventDetailsForm.invalid) {
      const text: string = this.translator.instant(
        'common-errors.required-fields'
      );
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        text,
      ]);
      return;
    }

    const detailsForm = this.eventDetailsForm.value;

    const publicEventDetails: EventDetailsDTO = {
      eventId: this.publicEventTokenDTO.eventId,
      eventCategory: detailsForm.eventCategory,
      eventName: detailsForm.eventName,
      eventDescription: detailsForm.eventDescription,
    };

    this.store.dispatch(
      updatePublicEventDetails({ eventDetails: publicEventDetails })
    );
  }

  private processPublicEventToken(): void {
    if (this.publicEventTokenDTO?.profileImage) {
      const imagePath = this.publicEventTokenDTO?.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    Object.entries(PublicEventCategories).forEach(([key, value]) => {
      if (value === this.publicEventTokenDTO.eventCategory) {
        this.publicEventCategory = key;
        this.eventDetailsForm.patchValue({ eventCategory: value });
      }
    });

    this.eventDetailsForm.patchValue({
      eventName: this.publicEventTokenDTO.eventName,
      eventDescription: this.publicEventTokenDTO.eventDescription,
    });
  }
}
