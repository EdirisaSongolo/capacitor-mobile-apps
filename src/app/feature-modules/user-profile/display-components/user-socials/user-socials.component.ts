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
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import { UserTokenDTO } from '@user-profile-core/api';
import {
  retrieveUserProfileSocials,
  socialsDisplaySelector,
  userSocialsSelector,
} from '@user-profile-core/store';
import { SocialsDisplay } from '@user-profile-core/data-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { serviceProviderSelector } from '@profile-accounts-core/store';

@Component({
  selector: 'Tsk-user-socials',
  templateUrl: './user-socials.component.html',
  styleUrls: ['./user-socials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserSocialsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public socialsDisplay: SocialsDisplay = SocialsDisplay.followers;
  public displayTypes: typeof SocialsDisplay = SocialsDisplay;
  public tabIndex: number = 0;
  public profileName: string;
  public userFollowers: UserTokenDTO[] = [];
  public userFollowing: UserTokenDTO[] = [];
  public userSuggestions: UserTokenDTO[] = [];

  private profileDTO: ProfileDTO;
  private userSocials: UserTokenDTO[];

  private userSocials$: Observable<UserTokenDTO[]> =
    this.store.select(userSocialsSelector);
  private socialsDisplay$: Observable<SocialsDisplay> = this.store.select(
    socialsDisplaySelector
  );
  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
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
    const breakpointSub = this.breakPoint$.subscribe(
      device => (this.device = device)
    );

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveUserProfileSocials({ profile: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          const userToken = serviceProvider as UserTokenDTO;
          this.profileName = userToken.userName;
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);

    const socialsDisplaySub = this.socialsDisplay$.subscribe(socialsDisplay => {
      this.socialsDisplay = socialsDisplay;
      this.tabIndex =
        this.socialsDisplay === this.displayTypes.followers ? 0 : 1;
    });

    this.subscriptions.add(socialsDisplaySub);

    const userSocialsSub = this.userSocials$.subscribe(userSocials => {
      if (userSocials) {
        this.userSocials = [...userSocials];

        this.userFollowers = this.userSocials.filter(
          social => social?.followerStatus === RequestStatus.confirmed
        );

        this.userFollowing = this.userSocials.filter(
          social => social?.followingStatus === RequestStatus.confirmed
        );
      }
    });

    this.subscriptions.add(userSocialsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
