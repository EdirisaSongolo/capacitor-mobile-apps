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
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO } from '@app-core/app-api';

import { UserTokenDTO } from '@user-profile-core/api';
import {
  retrieveSocialsSuggestions,
  retrieveUserProfileSocials,
  socialsDisplaySelector,
  socialsSuggestionsSelector,
  userSocialsSelector,
} from '@user-profile-core/store';
import {
  SocialsDisplay,
  UserSocialsAction,
} from '@user-profile-core/data-models';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { userProfileInfoSelector } from '@core-modules';

@Component({
  selector: 'Tsk-account-socials',
  templateUrl: './account-socials.component.html',
  styleUrls: ['./account-socials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AccountSocialsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public socialsDisplay: SocialsDisplay = SocialsDisplay.followers;
  public displayTypes: typeof SocialsDisplay = SocialsDisplay;
  public tabIndex: number = 0;

  public userProfileId: string;
  public displaySuggestions: boolean = true;

  public userFollowers: UserTokenDTO[] = [];
  public userFollowing: UserTokenDTO[] = [];
  public userSuggestions: UserTokenDTO[] = [];

  private socialsSuggestions: UserTokenDTO[] = [];
  private userSocials: UserTokenDTO[];

  private socialsSuggestions$: Observable<UserTokenDTO[]> = this.store.select(
    socialsSuggestionsSelector
  );
  private userSocials$: Observable<UserTokenDTO[]> =
    this.store.select(userSocialsSelector);
  private socialsDisplay$: Observable<SocialsDisplay> = this.store.select(
    socialsDisplaySelector
  );
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
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

    const socialsDisplaySub = this.socialsDisplay$.subscribe(socialsDisplay => {
      this.socialsDisplay = socialsDisplay;
      this.tabIndex =
        this.socialsDisplay === this.displayTypes.followers ? 0 : 1;
    });

    this.subscriptions.add(socialsDisplaySub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo?.userProfileId) {
          this.userProfileId = userProfileInfo?.userProfileId;
          const profile: ProfileDTO = {
            profile: Profiles.userProfile,
            profileId: this.userProfileId,
          };

          this.store.dispatch(retrieveUserProfileSocials({ profile: profile }));
          this.store.dispatch(retrieveSocialsSuggestions({ profile: profile }));
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const userSocialsSub = this.userSocials$.subscribe(userSocials => {
      if (userSocials) {
        this.userSocials = [...userSocials];

        this.userFollowers = this.userSocials.filter(
          social => social?.followerStatus === RequestStatus.confirmed
        );

        this.userFollowing = this.userSocials.filter(
          social => social?.followingStatus === RequestStatus.confirmed
        );

        this.processUserSuggestions();
      }
    });

    this.subscriptions.add(userSocialsSub);

    const suggestionsSub = this.socialsSuggestions$.subscribe(suggestions => {
      if (suggestions) {
        this.socialsSuggestions = [...suggestions];
        this.processUserSuggestions();
      }
    });

    this.subscriptions.add(suggestionsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // create a shared service for this function, the comp for the user socials displays something similar
  public userSocialsAction(userSocialsAction: UserSocialsAction): void {
    // const action: SocialsAction = userSocialsAction.socialsAction;
    // const profileDTO: ProfileDTO = {
    //   profile: Profiles.userProfile,
    //   profileName: userSocialsAction.userName,
    // };
    // if (action === SocialsAction.follow) {
    //   this.store.dispatch(followUserProfile({ profileDTO: profileDTO }));
    // } else if (action === SocialsAction.contact) {
    //   // this.store.dispatch(createContactRequest({ profileDTO: profileDTO }));
    // }
  }

  private processUserSuggestions(): void {
    const followingProfileIds: string[] = this.userFollowing.map(
      social => social.userProfileId
    );
    this.userSuggestions = this.socialsSuggestions.filter(
      suggestion => !followingProfileIds.includes(suggestion.userProfileId)
    );
  }
}
