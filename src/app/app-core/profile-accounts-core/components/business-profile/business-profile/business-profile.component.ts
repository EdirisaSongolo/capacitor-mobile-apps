import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {
  ComponentAction,
  DialogAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProfileDTO } from '@app-core/app-api/app-api.dto-models';

import {
  BusinessProfileStatus,
  ProfileAccountsConstants,
  RateUnitsOptions,
  ServiceDialogAction,
  UserProfileCategories,
  VendorCategories,
  VenueCategories,
} from '@profile-accounts-core/data-models';

import {
  createProviderService,
  deleteProviderService,
  disableServiceProvider,
  registerBusinessProfile,
  updateBusinessProfileBaseRate,
  updateBusinessProfileCategory,
  updateProviderService,
  retrieveBusinessProfile,
  businessProfileSelector,
} from '@profile-accounts-core/store';

import {
  BusinessProfileDTO,
  ProviderServiceDTO,
} from '@profile-accounts-core/api/profile-accounts.dto-models';
import { profileDTOSelector } from '@app-domain/store';

@Component({
  selector: 'Tsk-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BusinessProfileComponent implements OnInit, OnDestroy {
  @ViewChild('base_rate_dialog') baseRateDialog!: ElementRef<HTMLDivElement>;
  @ViewChild('service_dialog') serviceDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public componentAction: ComponentAction = ComponentAction.dashboard;

  public businessProfile: BusinessProfileDTO;
  public profileStatus: BusinessProfileStatus = BusinessProfileStatus.disabled;
  public statusOptions: typeof BusinessProfileStatus = BusinessProfileStatus;
  public businessCategory: string = 'other';
  public businessCategoriesNames: string[][] = [
    ['other', ProfileAccountsConstants.other],
  ];

  public displayBaseRateDialog: boolean = false;
  public rateDetails: Map<string, string | number> = new Map();
  public profileBaseRate: number = 0.0;
  public profileRateUnits: string =
    ProfileAccountsConstants.RateUnitsOptionsList.not_selected;
  public rateUnitsOptionsList: string[][] = Object.entries(
    ProfileAccountsConstants.RateUnitsOptionsList
  ).map(([key, name]) => {
    const value = RateUnitsOptions[key as keyof typeof RateUnitsOptions];
    return [value, name];
  });

  public servicesIcon: string = 'linked_services';
  public displayServiceDialog: boolean = false;
  public serviceDialogAction: ServiceDialogAction;
  public providerServices: ProviderServiceDTO[] = [];
  public providerService: ProviderServiceDTO;
  public confirmationDialog: boolean = false;
  public deleteConfirmation: string =
    'profile-accounts.business-profile.services.confirm-delete-action';
  public disableConfirmationDialog: boolean = false;
  public disableConfirmation: string =
    'profile-accounts.business-profile.confirm-disable-action';

  private profileDTO: ProfileDTO;
  private businessCategories: string[][] = [[]];
  private rateUnits: string[][] = Object.entries(RateUnitsOptions).map(
    ([name, value]) => [name, value]
  );

  private businessProfile$: Observable<BusinessProfileDTO> = this.store.select(
    businessProfileSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveBusinessProfile({ profileDTO: this.profileDTO })
        );
        this.setBusinessCategories();
      }
    });

    this.subscriptions.add(profileDTOSub);

    const businessProfileSub = this.businessProfile$.subscribe(
      businessProfile => {
        if (businessProfile && businessProfile?.businessProfileId) {
          this.businessProfile = { ...businessProfile };
          this.processBusinessProfile(this.businessProfile);
        }
      }
    );

    this.subscriptions.add(businessProfileSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public setAccountStatus(status: MatSlideToggleChange) {
    const enableAccount = status.checked;
    if (enableAccount === true) {
      this.store.dispatch(
        registerBusinessProfile({ profileDTO: this.profileDTO })
      );
    } else if (enableAccount === false) {
      status.source.checked = true;
      this.disableConfirmationDialog = true;
    }
  }

  public disableDialogAction(dialogAction: DialogAction): void {
    if (dialogAction === DialogAction.confirmed) {
      this.store.dispatch(
        disableServiceProvider({ profileDTO: this.profileDTO })
      );
    }

    this.disableConfirmationDialog = false;
  }

  public updateBusinessCategory(category: string): void {
    let businessCategory: string;

    this.businessCategories.forEach(([name, value]) => {
      if (name === category) {
        businessCategory = value;
      }
    });

    this.businessProfile = {
      ...this.businessProfile,
      businessCategory: businessCategory,
    };

    this.store.dispatch(
      updateBusinessProfileCategory({ businessProfile: this.businessProfile })
    );
  }

  public editProfileBaseRate(): void {
    if (this.profileStatus === this.statusOptions.disabled) {
      return;
    }

    this.displayBaseRateDialog = true;
  }

  public submitProviderBaseRate(
    rateDetails: Map<string, string | number>
  ): void {
    const baseRate = rateDetails.get('baseRate') as number;
    const rateUnits = rateDetails.get('rateUnits') as string;
    this.businessProfile = {
      ...this.businessProfile,
      paymentRateInCents: baseRate,
      rateUnits: rateUnits,
    };

    this.store.dispatch(
      updateBusinessProfileBaseRate({ businessProfile: this.businessProfile })
    );

    this.closeDialog();
  }

  public createService(): void {
    this.serviceDialogAction = ServiceDialogAction.createService;
    this.displayServiceDialog = !this.displayServiceDialog;
    this.displayBaseRateDialog = false;
  }

  public editService(providerService: ProviderServiceDTO): void {
    this.serviceDialogAction = ServiceDialogAction.editService;
    this.providerService = providerService;
    this.displayServiceDialog = true;
    this.displayBaseRateDialog = false;
  }

  public deleteService(providerService: ProviderServiceDTO): void {
    this.providerService = providerService;
    this.confirmationDialog = true;
    this.closeDialog();
  }

  public propateDialogAction(dialogAction: DialogAction) {
    if (dialogAction === DialogAction.cancelled) {
      this.confirmationDialog = false;
    } else if (dialogAction === DialogAction.confirmed) {
      this.deleteProfileService();
      this.confirmationDialog = false;
    }
  }

  public deleteProfileService(): void {
    this.store.dispatch(
      deleteProviderService({ providerService: this.providerService })
    );
    this.closeDialog();
  }

  public submitProviderService(providerService: ProviderServiceDTO): void {
    providerService.serviceProviderId = this.businessProfile.businessProfileId;

    if (this.serviceDialogAction === ServiceDialogAction.createService) {
      this.store.dispatch(
        createProviderService({ providerService: providerService })
      );
    } else if (this.serviceDialogAction === ServiceDialogAction.editService) {
      this.store.dispatch(
        updateProviderService({ providerService: providerService })
      );
    }

    this.closeDialog();
  }

  public componentClickEvent(event: MouseEvent): void {
    const rateDialogClick = this.baseRateDialog?.nativeElement.contains(
      event.target as Node
    );

    const servicesDialogClicked = this.serviceDialog?.nativeElement.contains(
      event.target as Node
    );

    if (!rateDialogClick && !servicesDialogClicked) {
      this.closeDialog();
    }
  }

  public dialogClickEvent(event: MouseEvent): void {
    event.stopPropagation();
  }

  public closeDialog(): void {
    if (this.displayServiceDialog) {
      this.displayServiceDialog = false;
    }

    if (this.displayBaseRateDialog) {
      this.displayBaseRateDialog = false;
    }
  }

  private setBusinessCategories(): void {
    this.businessCategoriesNames = [['other', ProfileAccountsConstants.other]];
    this.businessCategories = [];

    if (this.profileDTO.profile === Profiles.userProfile) {
      Object.entries(
        ProfileAccountsConstants.UserProfileCategoriesList
      ).forEach(([name, value]) => {
        this.businessCategoriesNames.push([name, value]);
      });

      Object.entries(UserProfileCategories).forEach(([name, value]) => {
        this.businessCategories.push([name, value]);
      });
    } else if (this.profileDTO.profile === Profiles.vendorProfile) {
      Object.entries(ProfileAccountsConstants.VendorCategoriesList).forEach(
        ([name, value]) => {
          this.businessCategoriesNames.push([name, value]);
        }
      );

      Object.entries(VendorCategories).forEach(([name, value]) => {
        this.businessCategories.push([name, value]);
      });
    } else if (this.profileDTO.profile === Profiles.venueProfile) {
      Object.entries(ProfileAccountsConstants.VenueCategoriesList).forEach(
        ([name, value]) => {
          this.businessCategoriesNames.push([name, value]);
        }
      );

      Object.entries(VenueCategories).forEach(([name, value]) => {
        this.businessCategories.push([name, value]);
      });
    }
  }

  private processBusinessProfile(businessProfile: BusinessProfileDTO): void {
    this.profileStatus = businessProfile.profileStatus as BusinessProfileStatus;

    const businessCategory = businessProfile.businessCategory;
    this.businessCategories.forEach(([name, value]) => {
      if (value === businessCategory) {
        this.businessCategory = name;
      }
    });

    if (businessProfile?.paymentRateInCents) {
      this.profileBaseRate = businessProfile.paymentRateInCents;
    }

    const providerRateUnits = businessProfile.rateUnits;
    const optionsList = ProfileAccountsConstants.RateUnitsOptionsList;
    this.rateUnits.forEach(([name, value]) => {
      if (value === providerRateUnits) {
        this.profileRateUnits =
          optionsList[
            name as keyof typeof ProfileAccountsConstants.RateUnitsOptionsList
          ];
      }
    });

    if (businessProfile?.services) {
      this.providerServices = [...businessProfile?.services];
    }

    this.rateDetails.set('baseRate', businessProfile.paymentRateInCents);
    this.rateDetails.set('rateUnits', businessProfile.rateUnits);
  }
}
