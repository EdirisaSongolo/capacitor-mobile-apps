import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, filter, firstValueFrom, skip } from 'rxjs';
import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { AppResponseService, BreakPointService } from '@domain-services/index';
import { ApiCallIndicatorService } from '@app-core/app-api';
import {
  retrieveRevenueAccount,
  revenueAccountSelector,
} from '@profile-revenue-core/store';
import { RevenueAccountDTO } from '@profile-revenue-core/api';
import { RevenueAccountStatus } from '@profile-revenue-core/data-models';
import { PublicEventPrincipalDTO } from '@public-events-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import {
  managedVendorsSelector,
  retrieveUserManagedVendors,
} from '@vendors-core/store';
import { eventPrincipalSelector } from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import { setEventPrincipalProfile } from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { ProfileDTO } from '@app-core/app-api';

export enum PrincipalDisplay {
  principal_selection = 'PRINCIPAL_SELECTION',
  managed_vendors = 'MANAGED_VENDORS',
  public_event_principal = 'PUBLIC_EVENT_PRINCIPAL',
}

@Component({
  selector: 'Tsk-public-event-principal',
  templateUrl: './public-event-principal.component.html',
  styleUrls: ['./public-event-principal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventPrincipalComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.dashboard;
  public principalDisplay: PrincipalDisplay =
    PrincipalDisplay.principal_selection;
  public displayOptions: typeof PrincipalDisplay = PrincipalDisplay;

  public eventPrincipal: VendorTokenDTO;
  public managedVendors: VendorTokenDTO[];

  private eventPrincipal$: Observable<PublicEventPrincipalDTO> =
    this.store.select(eventPrincipalSelector);
  private managedVendors$: Observable<VendorTokenDTO[]> = this.store.select(
    managedVendorsSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store<any>,
    private apiCallIndicator: ApiCallIndicatorService,
    private appResponse: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const managedVendorsSub = this.managedVendors$.subscribe(managedVendors => {
      this.managedVendors = managedVendors;
    });

    this.subscriptions.add(managedVendorsSub);

    const eventPrincipalSub = this.eventPrincipal$.subscribe(principal => {
      if (principal) {
        this.eventPrincipal = principal.principalProfile;
        this.principalDisplay = this.displayOptions.public_event_principal;
      }
    });

    this.subscriptions.add(eventPrincipalSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayUserManagedVendors(): void {
    this.store.dispatch(retrieveUserManagedVendors());
    this.principalDisplay = PrincipalDisplay.managed_vendors;
  }

  public async setPublicEventPrincipal(vendor: VendorTokenDTO): Promise<void> {
    const vendorProfile: ProfileDTO = {
      profile: Profiles.vendorProfile,
      profileId: vendor.vendorProfileId,
    };

    this.store.dispatch(retrieveRevenueAccount({ profileDTO: vendorProfile }));
    await firstValueFrom(
      this.apiCallIndicator.apiCallInProgress$.pipe(
        skip(1),
        filter(inProgress => !inProgress)
      )
    );

    const revenueAccount: RevenueAccountDTO = await firstValueFrom(
      this.store.select(revenueAccountSelector)
    );
    const accountStatus = revenueAccount?.accountStatus;
    if (accountStatus !== RevenueAccountStatus.healthy) {
      const messages: string[] = [
        'create-event.public-event.notifications.incomplete-business-profile',
      ];
      this.appResponse.createAppResponse(AppResponseType.warning, messages);
      return;
    }

    const eventPrincipal: PublicEventPrincipalDTO = {
      principalProfile: vendor,
    };

    this.store.dispatch(
      setEventPrincipalProfile({ eventPrincipal: eventPrincipal })
    );
  }
}
