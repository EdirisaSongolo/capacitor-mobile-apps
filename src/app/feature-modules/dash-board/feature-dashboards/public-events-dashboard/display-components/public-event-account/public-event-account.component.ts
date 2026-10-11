import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  eventPrincipalSelector,
  retrieveEventPrincipalProfile,
} from '@public-events-core/store';
import { PublicEventPrincipalDTO } from '@public-events-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

@Component({
  selector: 'Tsk-public-event-account',
  templateUrl: './public-event-account.component.html',
  styleUrls: ['./public-event-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventAccountComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public vendorToken: VendorTokenDTO;
  public componentAction: ComponentAction = ComponentAction.dashboard;

  private profileDTO: ProfileDTO;
  private principalProfile: PublicEventPrincipalDTO;

  private principalProfile$: Observable<PublicEventPrincipalDTO> =
    this.store.select(eventPrincipalSelector);
  private profileDTo$: Observable<ProfileDTO> =
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

    const profileDTOSub = this.profileDTo$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveEventPrincipalProfile({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const principalProfileSub = this.principalProfile$.subscribe(
      principalProfile => {
        if (principalProfile) {
          this.principalProfile = principalProfile;
          this.processPublicEventPrincipalProfile(this.principalProfile);
        }
      }
    );

    this.subscriptions.add(principalProfileSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private processPublicEventPrincipalProfile(
    principalProfile: PublicEventPrincipalDTO
  ): void {
    this.vendorToken = principalProfile.principalProfile;
  }
}
