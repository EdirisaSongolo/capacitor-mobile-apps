import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  BusinessProfileDTO,
  ProviderServiceDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import { serviceProviderSelector } from '@profile-accounts-core/store';
import {
  BusinessProfileStatus,
  ProfileAccountsConstants,
  RateUnitsOptions,
  UserProfileCategories,
  VendorCategories,
  VenueCategories,
} from '@profile-accounts-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';

@Component({
  selector: 'Tsk-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ServiceProviderComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public componentAction: ComponentAction = ComponentAction.profile;

  public profileStatus: BusinessProfileStatus = BusinessProfileStatus.enabled;
  public profileStatusOptions: typeof BusinessProfileStatus =
    BusinessProfileStatus;
  public businessCategory: string =
    'profile-accounts.business-profile.no-specified-category';
  public profileBaseRate: number = 0;
  public profileRateUnits: string;
  public profileServices: ProviderServiceDTO[] = [];

  private profileDTO: ProfileDTO;
  private serviceProvider: ServiceProviderDTO;
  private businessProfile: BusinessProfileDTO;

  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.businessProfile = this.serviceProvider.businessProfile;
          this.processBusinessProfile(this.businessProfile);
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processBusinessProfile(businessProfile: BusinessProfileDTO): void {
    this.profileStatus = businessProfile.profileStatus as BusinessProfileStatus;

    const businessCategory = businessProfile.businessCategory;
    this.processBusinessCategory(businessCategory);

    const paymentRateInCents = businessProfile?.paymentRateInCents;
    if (paymentRateInCents && paymentRateInCents !== 0) {
      this.profileBaseRate = businessProfile.paymentRateInCents;
    }

    const profileRateUnits = businessProfile.rateUnits;
    const rateUnits: string[][] = Object.entries(RateUnitsOptions).map(
      ([name, value]) => [name, value]
    );
    const optionsList = ProfileAccountsConstants.RateUnitsOptionsList;
    rateUnits.forEach(([name, value]) => {
      if (value === profileRateUnits) {
        this.profileRateUnits =
          optionsList[
            name as keyof typeof ProfileAccountsConstants.RateUnitsOptionsList
          ];
      }
    });

    this.profileServices = [...businessProfile?.services];
  }

  private processBusinessCategory(businessCategory: string): void {
    if (this.profileDTO.profile === Profiles.userProfile) {
      const categoryNames = ProfileAccountsConstants.UserProfileCategoriesList;
      Object.entries(UserProfileCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            this.businessCategory =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    } else if (this.profileDTO.profile === Profiles.vendorProfile) {
      const categoryNames = ProfileAccountsConstants.VendorCategoriesList;
      Object.entries(VendorCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            this.businessCategory =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    } else if (this.profileDTO.profile === Profiles.venueProfile) {
      const categoryNames = ProfileAccountsConstants.VenueCategoriesList;
      Object.entries(VenueCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            this.businessCategory =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    }
  }
}
