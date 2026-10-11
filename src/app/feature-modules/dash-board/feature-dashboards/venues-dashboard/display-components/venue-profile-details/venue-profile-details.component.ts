import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Device,
  AppResponseType,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { LocationDetails } from '@domain-data-models/app-domain.interfaces';
import { LocationDTO, ProfileDTO } from '@app-core/app-api/app-api.dto-models';
import { updateProfileImage } from '@media-core/store/media-actions';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import { VenueTokenDTO } from '@venues-core/api';
import { DetailsDisplay, VenuesConstants } from '@venues-core/data-models';
import {
  createVenueProfile,
  retrieveVenueToken,
  updateVenueProfileDetails,
  venuesDetailsSelector,
  venueTokenSelector,
} from '@venues-core/store';
import { profileDTOSelector } from '@app-domain/store';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-venue-profile-details',
  templateUrl: './venue-profile-details.component.html',
  styleUrls: ['./venue-profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueProfileDetailsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public detailsDisplay: DetailsDisplay = DetailsDisplay.CREATE_VENUE;
  public detailsDisplayOptions: typeof DetailsDisplay = DetailsDisplay;

  public venueProfileImage: string = `url(${VenuesConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public venueToken: VenueTokenDTO;

  public venueDetailsForm: FormGroup = this.formBuilder.group({
    venueName: ['', Validators.required],
    venueLocation: ['', Validators.required],
    venueDescription: [''],
  });

  public possibleLocations: Observable<string[]>;

  private profile: ProfileDTO;
  private locationInput: string;

  private venueToken$: Observable<VenueTokenDTO> =
    this.store.select(venueTokenSelector);
  private detailsDisplaySelector$: Observable<DetailsDisplay> =
    this.store.select(venuesDetailsSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private geoLocation: GeoLocationService,
    private locationMappers: LocationMappersService,
    private appResponse: AppResponseService,
    private filePickerService: FilePickerService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const venueLocationSub = this.venueDetailsForm
      .get('venueLocation')
      ?.valueChanges.subscribe(userInput => {
        if (userInput) {
          this.locationInput = userInput as string;
          this.possibleLocations =
            this.geoLocation.locationAutoCompleteSuggestions(
              this.locationInput
            );
        }
      });

    this.subscriptions.add(venueLocationSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profile = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const detailsDisplaySelectorSub = this.detailsDisplaySelector$.subscribe(
      detailsDisplay => {
        if (detailsDisplay) {
          this.detailsDisplay = detailsDisplay;
          if (
            this.detailsDisplay === this.detailsDisplayOptions.UPDATE_DETAILS
          ) {
            this.store.dispatch(retrieveVenueToken({ profile: this.profile }));
          }
        }
      }
    );

    this.subscriptions.add(detailsDisplaySelectorSub);

    const venueTokenSub = this.venueToken$.subscribe(venueToken => {
      if (
        venueToken &&
        this.detailsDisplay === this.detailsDisplayOptions.UPDATE_DETAILS
      ) {
        this.venueToken = { ...venueToken };
        this.processVenueDetails();
      }
    });

    this.subscriptions.add(venueTokenSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processVenueDetails(): void {
    if (
      this.venueToken?.profileImage &&
      this.venueToken?.profileImage !== null
    ) {
      const imagePath = this.venueToken?.profileImage;
      this.venueProfileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.venueDetailsForm.patchValue({
      venueName: this.venueToken?.venueName,
      venueDescription: this.venueToken?.venueDescription,
    });

    if (this.venueToken?.venueLocation?.address) {
      this.venueDetailsForm.patchValue({
        venueLocation: this.locationMappers.mapLocationDTOAddress(
          this.venueToken.venueLocation
        ),
      });
    }
  }

  public async updateVenueProfileImage(): Promise<void> {
    const [profileImageFile] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImageFile) {
      return;
    }

    const profile: ProfileDTO = {
      profile: Profiles.venueProfile,
      profileId: this.venueToken?.venueProfileId,
    };

    this.store.dispatch(
      updateProfileImage({ profile: profile, profileImage: profileImageFile })
    );
  }

  public async submitVenueProfileDetailsForm(): Promise<void> {
    if (this.venueDetailsForm.invalid) {
      const messages: string[] = [
        'venues-dashboard.venue-details.form-errors.invalid-form',
      ];
      this.appResponse.createAppResponse(AppResponseType.warning, messages);
      return;
    }

    const address = this.venueDetailsForm.get('venueLocation').value;
    const locationDetails: LocationDetails =
      await this.geoLocation.retrieveGeoLocationData(address);

    const locationDTO: LocationDTO =
      this.locationMappers.profileLocationDTO(locationDetails);

    if (!locationDTO) {
      const messages: string[] = ['common-errors.unresolved-address'];
      this.appResponse.createAppResponse(AppResponseType.error, messages);
      return;
    }

    const detailsFormValues = this.venueDetailsForm.value;

    const venueDTO: VenueTokenDTO | any = {
      profile: Profiles.venueProfile,
      venueName: detailsFormValues.venueName as string,
      venueDescription: detailsFormValues.venueDescription as string,
    };

    if (this.detailsDisplay === this.detailsDisplayOptions.UPDATE_DETAILS) {
      const detailsEqual: boolean =
        venueDTO.venueName === this.venueToken?.venueName &&
        venueDTO.venueDescription === this.venueToken?.venueDescription;

      const locationsEqual: boolean = this.locationMappers.compareLocationDTOs(
        this.venueToken?.venueLocation,
        locationDTO
      );

      if (detailsEqual && locationsEqual) {
        const messages: string[] = ['common.no-changes-in-details-update'];
        this.appResponse.createAppResponse(AppResponseType.warning, messages);
        return;
      }

      venueDTO.venueProfileId = this.venueToken?.venueProfileId;
      venueDTO.venueLocation = locationDTO;

      this.store.dispatch(updateVenueProfileDetails({ venueDTO: venueDTO }));
    } else if (
      this.detailsDisplay === this.detailsDisplayOptions.CREATE_VENUE
    ) {
      venueDTO.venueLocation = locationDTO;
      this.store.dispatch(createVenueProfile({ venueDTO: venueDTO }));
    }
  }
}
