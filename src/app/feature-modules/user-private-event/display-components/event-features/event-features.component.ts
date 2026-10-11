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
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  eventFeaturesSelector,
  retrieveEventFeatures,
} from '@private-events-core/store';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

@Component({
  selector: 'Tsk-event-features',
  templateUrl: './event-features.component.html',
  styleUrls: ['./event-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventFeaturesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public profileOptions: typeof Profiles = Profiles;
  public eventFeatures: ServiceProviderDTO[] = [];

  private profileDTO: ProfileDTO;

  private eventFeatures$: Observable<ServiceProviderDTO[]> = this.store.select(
    eventFeaturesSelector
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
          retrieveEventFeatures({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventFeaturesSub = this.eventFeatures$.subscribe(eventFeatures => {
      if (eventFeatures.length >= 1) {
        this.eventFeatures = [...eventFeatures];
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
