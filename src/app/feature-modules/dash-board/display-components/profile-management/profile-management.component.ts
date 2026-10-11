import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  Device,
  Profiles,
  ComponentAction,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  managedProfilesSelector,
  retrieveManagedProfiles,
} from '@profile-accounts-core/store';
import { VenueTokenDTO } from '@venues-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { ProfileDTO } from '@app-core/app-api';

enum ProfilesDisplay {
  profiles_list = 'PROFILES_LIST',
  venues = 'VENUES',
  vendors = 'VENDORS',
}

@Component({
  selector: 'Tsk-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileManagementComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profilesDisplay: ProfilesDisplay = ProfilesDisplay.profiles_list;
  public displayOptions: typeof ProfilesDisplay = ProfilesDisplay;
  public profileOptions: typeof Profiles = Profiles;
  public componentAction: ComponentAction = ComponentAction.dashboard;

  public managedProfiles: ServiceProviderDTO[] = [];
  public profileName: string;

  private managedProfiles$: Observable<ServiceProviderDTO[]> =
    this.store.select(managedProfilesSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private profileMapperService: ProfileMapperService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const managedProfilesSub = this.managedProfiles$.subscribe(
      managedProfiles => {
        if (managedProfiles?.length >= 1) {
          this.managedProfiles = [...managedProfiles];
        }
      }
    );

    this.subscriptions.add(managedProfilesSub);

    this.store.dispatch(retrieveManagedProfiles());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asVenueToken(serviceProvider: ServiceProviderDTO): VenueTokenDTO {
    return serviceProvider as VenueTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO): VendorTokenDTO {
    return serviceProvider as VendorTokenDTO;
  }

  public processProfileAction(serviceProvider: ServiceProviderDTO): void {
    const profileDTO: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);
    this.profileName = profileDTO.profileName;

    this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));
    this.store.dispatch(
      setComponentAction({ componentAction: ComponentAction.dashboard })
    );

    if (profileDTO.profile === Profiles.venueProfile) {
      this.profilesDisplay = ProfilesDisplay.venues;
    } else if (profileDTO.profile === Profiles.vendorProfile) {
      this.profilesDisplay = ProfilesDisplay.vendors;
    }
  }
}
