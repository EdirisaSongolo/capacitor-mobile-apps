import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BreakPointService } from '@domain-services/index';
import {
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { AuthService } from '@auth-core/auth-service';
import { setComponentAction, setProfileDTO } from '@app-domain/store';

import { ProfileDTO } from '@app-core/app-api';
import { UserTokenDTO } from '@app-core/user-profile-core/api';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import {
  retrieveServiceProvider,
  serviceProviderSelector,
  storeServiceProvider,
} from '@profile-accounts-core/store';
import {
  ProfileDisplay,
  ProfileDisplayPanel,
  SocialsDisplay,
  UserProfileRoutes,
} from '@user-profile-core/data-models';
import {
  followUserProfile,
  unfollowUserProfile,
  updateSocialsDisplay,
} from '@user-profile-core/store';
import { BusinessProfileStatus } from '@profile-accounts-core/data-models';
import { setChatContacts } from '@communications-core/store';
import { ChatProfileDTO } from '@communications-core/api';

@Component({
  selector: 'Tsk-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: typeof ComponentAction = ComponentAction;
  public displayPanel: ProfileDisplayPanel = ProfileDisplayPanel.media;
  public panelOptions: typeof ProfileDisplayPanel = ProfileDisplayPanel;

  public profileDTO: ProfileDTO;
  public displayControls: ProfileDisplay[] = [];
  public profileOptions: boolean = false;
  public followLabel: string = 'labels.follow';

  private serviceProvider: ServiceProviderDTO;
  private following: boolean = false;
  private authenticated: boolean = false;

  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileIdSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        const userProfileId = parameters.get('userProfileId');
        this.profileDTO = {
          profile: Profiles.userProfile,
          profileId: userProfileId,
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
    );

    this.subscriptions.add(userProfileIdSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.processServiceProvider(this.serviceProvider);
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);

    const authenticatedSub = this.authService.userAuthenicated$.subscribe(
      authenticated => {
        this.authenticated = authenticated;
        this.processProfileOptions();
      }
    );

    this.subscriptions.add(authenticatedSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processHeaderAction(socialsOption: SocialsDisplay): void {
    this.router.navigate([UserProfileRoutes.USER_SOCIALS], {
      relativeTo: this.activatedRoute,
    });
    this.store.dispatch(
      updateSocialsDisplay({ socialsDisplay: socialsOption })
    );
  }

  public updateDisplayPanel(route: UserProfileRoutes): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }

  public navigateToUserProfile(user: UserTokenDTO): void {
    this.router.navigate([UserProfileRoutes.USER_PROFILE, user.userProfileId]);
  }

  public updateFollowingStatus(): void {
    if (this.following) {
      this.store.dispatch(unfollowUserProfile({ profileDTO: this.profileDTO }));
      return;
    }

    this.store.dispatch(followUserProfile({ profileDTO: this.profileDTO }));
  }

  public messageUserProfile(): void {
    const userToken = this.serviceProvider as UserTokenDTO;
    const chatContact: ChatProfileDTO = {
      userProfileId: userToken.userProfileId,
      profileImage: userToken.profileImage,
      userName: userToken.userName,
    };

    this.store.dispatch(setChatContacts({ chatContacts: [chatContact] }));
    this.router.navigate(['/messaging']);
  }

  private processServiceProvider(serviceProvider: ServiceProviderDTO): void {
    const businessProfile: BusinessProfileDTO = serviceProvider.businessProfile;
    if (
      businessProfile &&
      businessProfile.profileStatus === BusinessProfileStatus.enabled
    ) {
      const displayControls: ProfileDisplay[] = [
        {
          display: ProfileDisplayPanel.media,
          name: '',
          icon: 'dashboard_2',
          route: UserProfileRoutes.MEDIA,
        },
        {
          display: ProfileDisplayPanel.business_profile,
          name: 'user-profile.profile-displays.profile.booking',
          icon: 'shape_line',
          route: UserProfileRoutes.BUSINESS_PROFILE,
        },
      ];

      this.displayControls = [...displayControls];
    }

    const userToken = serviceProvider as UserTokenDTO;
    this.following = userToken.followingStatus === RequestStatus.confirmed;
    this.processProfileOptions();
  }

  private processProfileOptions(): void {
    this.profileOptions = this.authenticated;

    let followLabel: string = 'labels.follow';
    if (this.following) followLabel = 'labels.unfollow';
    this.followLabel = followLabel;
  }
}
