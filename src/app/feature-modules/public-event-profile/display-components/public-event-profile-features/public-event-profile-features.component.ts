import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { profileDTOSelector } from '@app-domain/store';

import { ProfileDTO } from '@app-core/app-api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  publicEventFeaturesSelector,
  retrievePublicEventFeatures,
} from '@public-events-core/store';

@Component({
  selector: 'Tsk-public-event-profile-features',
  templateUrl: './public-event-profile-features.component.html',
  styleUrls: ['./public-event-profile-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileFeaturesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public profileOptions: typeof Profiles = Profiles;
  public publicEventFeatures: ServiceProviderDTO[] = [];

  private profileDTO: ProfileDTO;

  public eventFeatures$: Observable<ServiceProviderDTO[]> = this.store.select(
    publicEventFeaturesSelector
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
          retrievePublicEventFeatures({ profile: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventFeaturesSub = this.eventFeatures$.subscribe(eventFeatures => {
      if (eventFeatures.length >= 1) {
        this.publicEventFeatures = [...eventFeatures];
      }
    });

    this.subscriptions.add(eventFeaturesSub);
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
}
