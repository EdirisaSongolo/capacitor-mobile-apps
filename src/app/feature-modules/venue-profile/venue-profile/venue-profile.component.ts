import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, filter, firstValueFrom, skip } from 'rxjs';
import { ProfileDTO } from '@app-core/app-api';
import {
  ProfileDisplayPanel,
  ProfileDisplay,
  VenuesRoutes,
} from '@venues-core/data-models';
import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { ApiCallIndicatorService } from '@app-core/app-api';
import { AuthService } from '@auth-core/auth-service';
import { userProfileInfoSelector } from '@core-modules';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { ChatProfileDTO } from '@communications-core/api';
import { setChatContacts } from '@communications-core/store';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { VenueManagerDTO } from '@venues-core/api';
import {
  retrieveVenueProfileManagers,
  venueProfileManagementSelector,
} from '@venues-core/store';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import {
  retrieveServiceProvider,
  storeServiceProvider,
} from '@profile-accounts-core/store';

@Component({
  selector: 'Tsk-venue-profile',
  templateUrl: './venue-profile.component.html',
  styleUrls: ['./venue-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueProfileComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayControls: ProfileDisplay[] = [
    {
      display: ProfileDisplayPanel.media,
      name: 'venue-profile.profile-displays.media',
      icon: 'dashboard_2',
      route: VenuesRoutes.MEDIA,
    },
    {
      display: ProfileDisplayPanel.business_profile,
      name: 'venue-profile.profile-displays.profile.booking',
      icon: 'shape_line',
      route: VenuesRoutes.BUSINESS_PROFILE,
    },
    {
      display: ProfileDisplayPanel.management,
      name: 'venue-profile.profile-displays.management',
      icon: 'server_person',
      route: VenuesRoutes.MANAGEMENT,
    },
  ];

  public profileDTO: ProfileDTO;

  public profileOptions: boolean = false;

  private userProfileId: string;
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private authService: AuthService,
    private apiCallIndicator: ApiCallIndicatorService,
    private appResponse: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const routerSub = this.activatedRoute.paramMap.subscribe(parameters => {
      const venueProfileId = parameters.get('venueProfileId');

      if (venueProfileId) {
        this.profileDTO = {
          profile: Profiles.venueProfile,
          profileId: venueProfileId,
        };

        this.store.dispatch(setProfileDTO({ profileDTO: this.profileDTO }));
        this.store.dispatch(
          setComponentAction({ componentAction: ComponentAction.profile })
        );

        this.store.dispatch(storeServiceProvider({ serviceProvider: null }));
        this.store.dispatch(
          retrieveServiceProvider({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(routerSub);

    const authenticatedSub = this.authService.userAuthenicated$.subscribe(
      authenticated => {
        this.profileOptions = authenticated;
      }
    );

    this.subscriptions.add(authenticatedSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        this.userProfileId = userProfileInfo?.userProfileId;
      }
    );

    this.subscriptions.add(userProfileInfoSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async messageVenueProfile(): Promise<void> {
    this.store.dispatch(
      retrieveVenueProfileManagers({ profile: this.profileDTO })
    );
    await firstValueFrom(
      this.apiCallIndicator.apiCallInProgress$.pipe(
        skip(1),
        filter(inProgress => !inProgress)
      )
    );

    const profileManagers: VenueManagerDTO[] = await firstValueFrom(
      this.store.select(venueProfileManagementSelector)
    );
    const chatContacts: ChatProfileDTO[] =
      this.processManagerChatContacts(profileManagers);

    if (chatContacts.length === 0) {
      const messages: string[] = ['venue-profile.only-venue-manager'];
      this.appResponse.createAppResponse(AppResponseType.warning, messages);
      return;
    }

    this.store.dispatch(setChatContacts({ chatContacts: chatContacts }));
    this.router.navigate(['/messaging']);
  }

  private processManagerChatContacts(
    profileManagers: VenueManagerDTO[]
  ): ChatProfileDTO[] {
    const confirmedManagers = profileManagers.filter(
      profileManager =>
        profileManager.managerStatus === RequestStatus.confirmed &&
        profileManager.manager.userProfileId !== this.userProfileId
    );

    return confirmedManagers.map(profileManager => {
      const manager = profileManager.manager;
      const chatContact: ChatProfileDTO = {
        userProfileId: manager.userProfileId,
        profileImage: manager.profileImage,
        userName: manager.userName,
      };
      return chatContact;
    });
  }

  public updateDisplayPanel(route: VenuesRoutes): void {
    this.router.navigate([route], {
      relativeTo: this.activatedRoute,
    });
  }
}
