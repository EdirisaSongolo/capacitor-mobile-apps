import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device, Profiles } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserPublicEventDTO } from '@public-events-core/api';
import { userPublicEventSelector } from '@public-events-core/store';
import { UserTokenDTO } from '@user-profile-core/api';
import { UserProfileRoutes } from '@user-profile-core/data-models';
import { VendorTokenDTO } from '@vendors-core/api';
import { VendorsRoutes } from '@vendors-core/data-models';

@Component({
  selector: 'Tsk-date-features',
  templateUrl: './date-features.component.html',
  styleUrls: ['./date-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DateFeaturesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public profileOptions: typeof Profiles = Profiles;

  public dateFeatures: ServiceProviderDTO[] = [];

  private userPublicEvent$: Observable<UserPublicEventDTO> = this.store.select(
    userPublicEventSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userPublicEventSub = this.userPublicEvent$.subscribe(
      userPublicEvent => {
        if (userPublicEvent) {
          this.processUserPublicEvent(userPublicEvent);
        }
      }
    );

    this.subscriptions.add(userPublicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as UserTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as VendorTokenDTO;
  }

  public serviceProviderProfilePage(
    profile: Profiles,
    serviceProvider: ServiceProviderDTO
  ): void {
    if (profile === this.profileOptions.userProfile) {
      const userProfile = serviceProvider as UserTokenDTO;
      this.router.navigate([
        UserProfileRoutes.USER_PROFILE,
        userProfile.userProfileId,
      ]);
    } else if (profile === this.profileOptions.vendorProfile) {
      const vendorProfile = serviceProvider as VendorTokenDTO;
      this.router.navigate([
        VendorsRoutes.VENDOR_PROFILE,
        vendorProfile.vendorProfileId,
      ]);
    }
  }

  private processUserPublicEvent(userPublicEvent: UserPublicEventDTO): void {
    const dateFeatures = userPublicEvent.publicEventDate?.dateFeatures;
    if (dateFeatures && dateFeatures.length >= 1) {
      this.dateFeatures = [...dateFeatures];
    }
  }
}
