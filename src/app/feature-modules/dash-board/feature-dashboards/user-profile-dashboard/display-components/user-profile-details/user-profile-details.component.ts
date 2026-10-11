import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  Device,
  AppResponseType,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserProfileDTO } from '@user-profile-core/api';
import {
  retrieveUserProfile,
  updateUserProfile,
  userProfileSelector,
} from '@app-core/user-profile-core/store';
import {
  LocationDetails,
  UserProfileInfo,
} from '@domain-data-models/app-domain.interfaces';

import { userProfileInfoSelector } from '@core-modules';
import { LocationDTO, ProfileDTO } from '@app-core/app-api';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileDetailsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public userProfileFormFields: any[] = [
    {
      label: 'user-profile-dashboard.details.user-details-form.first-name',
      type: 'text',
      control: 'firstName',
    },
    {
      label: 'user-profile-dashboard.details.user-details-form.last-name',
      type: 'text',
      control: 'lastName',
    },
    {
      label: 'user-profile-dashboard.details.user-details-form.user-name',
      type: 'text',
      control: 'userName',
    },
    {
      label: 'user-profile-dashboard.details.user-details-form.email-address',
      type: 'email',
      control: 'emailAddress',
    },
  ];

  public userProfileForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    emailAddress: ['', [Validators.email, Validators.required]],
    address: [],
    biography: [],
  });

  public possibleLocations: Observable<string[]>;
  private locationInput: string;

  private userProfile: UserProfileDTO;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private userProfile$: Observable<UserProfileDTO> =
    this.store.select(userProfileSelector);
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private geoLocation: GeoLocationService,
    private locationMappers: LocationMappersService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const addressChangeSub = this.userProfileForm
      .get('address')
      ?.valueChanges.subscribe(userInput => {
        if (userInput) {
          this.locationInput = userInput as string;
          this.possibleLocations =
            this.geoLocation.locationAutoCompleteSuggestions(
              this.locationInput
            );
        }
      });

    this.subscriptions.add(addressChangeSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo.userProfileId) {
          const profileDTO: ProfileDTO = {
            profile: Profiles.userProfile,
            profileId: userProfileInfo.userProfileId,
          };
          this.store.dispatch(retrieveUserProfile({ profileDTO: profileDTO }));
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const userProfileSub = this.userProfile$.subscribe(userProfile => {
      this.userProfile = userProfile;
      if (userProfile !== null) {
        this.processUserProfileDetails(userProfile);
      }
    });

    this.subscriptions.add(userProfileSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async updateUserProfile(): Promise<void> {
    const userProfileForm: FormGroup = this.userProfileForm;
    if (userProfileForm.invalid) {
      this.appResponseService.createAppResponse(AppResponseType.error, [
        'user-profile-dashboard.details.form-errors.missing-required-fields',
      ]);
      return;
    }

    let isTheSameObject: boolean = true;
    Object.entries(this.userProfile).forEach(([field, fieldValue]) => {
      const formControl = userProfileForm.get(field);
      if (formControl && formControl.value !== fieldValue) {
        isTheSameObject = false;
      }
    });

    const userLocation = this.userProfile.userLocation;
    const address = userProfileForm.get('address').value;
    const newAddress: boolean = address && address.length !== 0;
    let locationDetails: LocationDetails;
    let locationDTO: LocationDTO;

    if (!newAddress && userLocation?.latitude && userLocation?.longitude) {
      isTheSameObject = false;
    }

    if (newAddress) {
      locationDetails = await this.geoLocation.retrieveGeoLocationData(address);
      locationDTO = this.locationMappers.profileLocationDTO(locationDetails);

      if (!locationDTO) {
        this.appResponseService.createAppResponse(AppResponseType.error, [
          'common-errors.unresolved-address',
        ]);
        return;
      }

      const isEqual: boolean = this.locationMappers.compareLocationDTOs(
        locationDTO,
        userLocation
      );

      if (!isEqual) {
        isTheSameObject = false;
      }
    }

    if (isTheSameObject) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'user-profile-dashboard.details.form-errors.is-the-same-object',
      ]);
      return;
    }

    const userProfileDetails: any = userProfileForm.value;
    const userProfile: UserProfileDTO = {
      userProfileId: this.userProfile.userProfileId,
      firstName: userProfileDetails.firstName,
      lastName: userProfileDetails.lastName,
      userName: userProfileDetails.userName,
      emailAddress: userProfileDetails.emailAddress,
      userLocation: locationDTO,
      biography: userProfileDetails?.biography,
    };
    this.store.dispatch(updateUserProfile({ userProfile: userProfile }));
  }

  private processUserProfileDetails(userProfile: UserProfileDTO): void {
    Object.entries(userProfile).forEach(([field, fieldValue]) => {
      const formControl = this.userProfileForm.get(field);
      if (formControl) {
        formControl.setValue(fieldValue);
      }
    });

    if (userProfile?.userLocation?.address) {
      this.userProfileForm.patchValue({
        address: this.locationMappers.mapLocationDTOAddress(
          userProfile.userLocation
        ),
      });
    }
  }
}
