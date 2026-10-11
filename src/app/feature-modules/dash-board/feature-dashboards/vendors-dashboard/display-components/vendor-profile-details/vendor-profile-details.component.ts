import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { LocationDetails } from '@domain-data-models/app-domain.interfaces';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { LocationDTO, ProfileDTO } from '@app-core/app-api/app-api.dto-models';
import { VendorTokenDTO } from '@app-core/vendors-core/api';
import { updateProfileImage } from '@app-core/media-core/store';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import { DetailsDisplay } from '@vendors-core/data-models';
import { VendorsConstants } from '@vendors-core/data-models/vendors.constants';
import {
  createVendorProfile,
  vendorsDetailsSelector,
  retrieveVendorToken,
  updateVendorProfileDetails,
  vendorTokenSelector,
} from '@vendors-core/store';
import { profileDTOSelector } from '@app-domain/store';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-vendor-profile-details',
  templateUrl: './vendor-profile-details.component.html',
  styleUrls: ['./vendor-profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorProfileDetailsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public detailsDisplay: DetailsDisplay = DetailsDisplay.CREATE_VENDOR;
  public detailsDisplayOptions: typeof DetailsDisplay = DetailsDisplay;

  public vendorProfileImage: string = `url(${VendorsConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public vendor: VendorTokenDTO;

  public vendorDetailsForm = this.formBuilder.group({
    vendorName: ['', Validators.required],
    vendorLocation: ['', Validators.required],
    vendorDescription: [''],
  });

  public possibleLocations: Observable<string[]>;

  private profile: ProfileDTO;
  private locationInput: string;

  private vendor$: Observable<VendorTokenDTO> =
    this.store.select(vendorTokenSelector);
  private detailsDisplaySelector$: Observable<DetailsDisplay> =
    this.store.select(vendorsDetailsSelector);
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

    const vendorLocationSub = this.vendorDetailsForm
      .get('vendorLocation')
      ?.valueChanges.subscribe(userInput => {
        if (userInput) {
          this.locationInput = userInput as string;
          this.possibleLocations =
            this.geoLocation.locationAutoCompleteSuggestions(
              this.locationInput
            );
        }
      });

    this.subscriptions.add(vendorLocationSub);

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
            this.store.dispatch(retrieveVendorToken({ profile: this.profile }));
          }
        }
      }
    );

    this.subscriptions.add(detailsDisplaySelectorSub);

    const vendorProfileSub = this.vendor$.subscribe(vendorProfile => {
      this.vendor = { ...vendorProfile };
      if (vendorProfile) {
        this.processVendorDetails();
      }
    });

    this.subscriptions.add(vendorProfileSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processVendorDetails(): void {
    if (this.vendor?.profileImage && this.vendor?.profileImage !== null) {
      const profileImagePath: string = this.vendor?.profileImage;
      this.vendorProfileImage = `url(${profileImagePath}) center center / contain no-repeat`;
    }

    this.vendorDetailsForm.patchValue({
      vendorName: this.vendor?.vendorName,
      vendorDescription: this.vendor?.vendorDescription,
    });

    if (this.vendor?.vendorLocation?.address) {
      this.vendorDetailsForm.patchValue({
        vendorLocation: this.locationMappers.mapLocationDTOAddress(
          this.vendor.vendorLocation
        ),
      });
    }
  }

  public async updateVendorProfileImage(): Promise<void> {
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

  public async submitVendorDetailsForm(): Promise<void> {
    if (this.vendorDetailsForm.invalid) {
      const messages: string[] = [
        'vendors-dashboard.vendor-details.form-errors.invalid-form',
      ];
      this.appResponse.createAppResponse(AppResponseType.warning, messages);
      return;
    }

    const address = this.vendorDetailsForm.get('vendorLocation').value;
    const locationDetails: LocationDetails =
      await this.geoLocation.retrieveGeoLocationData(address);

    const locationDTO: LocationDTO =
      this.locationMappers.profileLocationDTO(locationDetails);

    if (!locationDTO) {
      const messages: string[] = ['common-errors.unresolved-address'];
      this.appResponse.createAppResponse(AppResponseType.error, messages);
      return;
    }

    const detailsFormValues = this.vendorDetailsForm.value;

    const vendorDTO: VendorTokenDTO | any = {
      profile: Profiles.vendorProfile,
      vendorName: detailsFormValues.vendorName as string,
      vendorDescription: detailsFormValues.vendorDescription as string,
    };

    if (this.detailsDisplay === this.detailsDisplayOptions.UPDATE_DETAILS) {
      const detailsEqual: boolean =
        vendorDTO.vendorName === this.vendor?.vendorName &&
        vendorDTO.vendorDescription === this.vendor?.vendorDescription;

      const locationsEqual: boolean = this.locationMappers.compareLocationDTOs(
        this.vendor?.vendorLocation,
        locationDTO
      );

      if (detailsEqual && locationsEqual) {
        const messages: string[] = ['common.no-changes-in-details-update'];
        this.appResponse.createAppResponse(AppResponseType.warning, messages);
        return;
      }

      vendorDTO.vendorProfileId = this.vendor?.vendorProfileId;
      vendorDTO.vendorLocation = locationDTO;

      this.store.dispatch(updateVendorProfileDetails({ vendorDTO: vendorDTO }));
    } else if (
      this.detailsDisplay === this.detailsDisplayOptions.CREATE_VENDOR
    ) {
      vendorDTO.vendorLocation = locationDTO;
      this.store.dispatch(createVendorProfile({ vendorDTO: vendorDTO }));
    }
  }
}
