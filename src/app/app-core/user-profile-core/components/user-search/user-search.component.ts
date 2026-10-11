import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserTokenDTO } from '@user-profile-core/api';
import {
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  retrieveUserProfileSocials,
  retrieveUserSearchResults,
  userSearchSelector,
  userSocialsSelector,
} from '@app-core/user-profile-core/store';
import { ProfileDTO, SearchDTO } from '@app-core/app-api';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { userProfileInfoSelector } from '@core-modules';
import { UserSearch, UserSearchDisplay } from '@user-profile-core/data-models';

@Component({
  selector: 'Tsk-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserSearchComponent implements OnInit, OnDestroy {
  @Input() public userSearch: UserSearch;
  @Output() public placAction: EventEmitter<UserTokenDTO> = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public componentAction: ComponentAction = ComponentAction.dashboard;

  public userSearchDisplay: UserSearchDisplay = UserSearchDisplay.user_socials;
  public displayOptions: typeof UserSearchDisplay = UserSearchDisplay;

  public userSearchForm: FormGroup = this.formBuilder.group({
    user_search: [''],
  });

  public userFollowers: UserTokenDTO[] = [];
  public userFollowing: UserTokenDTO[] = [];
  public userSearchResults: UserTokenDTO[] = [];

  private userSocials: UserTokenDTO[];
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private userProfileSocials$: Observable<UserTokenDTO[]> =
    this.store.select(userSocialsSelector);
  private userSearchResults$: Observable<UserTokenDTO[]> =
    this.store.select(userSearchSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(
      device => (this.device = device)
    );

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo?.userProfileId) {
          const profile: ProfileDTO = {
            profile: Profiles.userProfile,
            profileId: userProfileInfo.userProfileId,
          };

          this.store.dispatch(retrieveUserProfileSocials({ profile: profile }));
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const userSocialsSub = this.userProfileSocials$.subscribe(userSocials => {
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

    const userSearchResultsSub = this.userSearchResults$.subscribe(
      userSearchResults => {
        this.userSearchResults = userSearchResults;
      }
    );

    this.subscriptions.add(userSearchResultsSub);

    const userSearchSub = this.userSearchForm
      .get('user_search')
      .valueChanges.subscribe(input => {
        const len = input.length;
        this.userSearchDisplay =
          len >= 1
            ? this.displayOptions.search_results
            : this.displayOptions.user_socials;

        if (this.userSearchDisplay === this.displayOptions.user_socials) {
          this.userSearchResults = [];
        }

        if (len >= 3) {
          const searchDTO: SearchDTO = { searchParam: input };
          if (this.userSearch === UserSearch.user_socials) {
            this.filterUserSocials(searchDTO);
          } else {
            this.store.dispatch(
              retrieveUserSearchResults({ searchParam: searchDTO })
            );
          }
        }
      });

    this.subscriptions.add(userSearchSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public propateUserPlacAction(userTokenDTO: UserTokenDTO): void {
    this.placAction.emit(userTokenDTO);
  }

  private filterUserSocials(searchDTO: SearchDTO): void {
    const searchParams = searchDTO.searchParam.toLowerCase();

    const filteredProfiles = this.userSocials.filter(userToken => {
      return (
        userToken.firstName.toLowerCase().includes(searchParams) ||
        userToken.lastName.toLowerCase().includes(searchParams) ||
        userToken.userName.toLowerCase().includes(searchParams)
      );
    });

    this.userSearchResults = [...filteredProfiles];
  }
}
