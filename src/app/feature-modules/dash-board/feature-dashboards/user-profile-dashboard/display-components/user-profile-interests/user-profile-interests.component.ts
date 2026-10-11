import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { BreakPointService } from '@domain-services/index';
import { Device, AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { createAppResponse, userProfileLoadedSelector } from '@core-modules';
import { UserInterestsDTO } from '@app-core/user-profile-core/api';
import {
  retrieveUserInterests,
  updateUserInterests,
  userInterestsSelector,
} from '@app-core/user-profile-core/store';

@Component({
  selector: 'Tsk-user-profile-interests',
  templateUrl: './user-profile-interests.component.html',
  styleUrls: ['./user-profile-interests.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileInterestsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public userInterests: any[] = [
    {
      key: 'music',
      label: 'user-profile-dashboard.interests.options.music',
      value: '',
    },
    {
      key: 'art',
      label: 'user-profile-dashboard.interests.options.art',
      value: '',
    },
    {
      key: 'motorEvents',
      label: 'user-profile-dashboard.interests.options.motorEvents',
      value: '',
    },
    {
      key: 'sports',
      label: 'user-profile-dashboard.interests.options.sports',
      value: '',
    },
    {
      key: 'familyEvents',
      label: 'user-profile-dashboard.interests.options.familyEvents',
      value: '',
    },
    {
      key: 'fashion',
      label: 'user-profile-dashboard.interests.options.fashion',
      value: '',
    },
    {
      key: 'academicEvents',
      label: 'user-profile-dashboard.interests.options.academicEvents',
      value: '',
    },
  ];

  private userProfileInterests: UserInterestsDTO;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private userInterests$: Observable<UserInterestsDTO> = this.store.select(
    userInterestsSelector
  );
  private profileLoaded$: Observable<boolean> = this.store.select(
    userProfileLoadedSelector
  );
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private translator: TranslateService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileLoadedSub = this.profileLoaded$.subscribe(profileLoaded => {
      if (profileLoaded) {
        this.store.dispatch(retrieveUserInterests());
      }
    });

    this.subscriptions.add(profileLoadedSub);

    const userInterestsSub = this.userInterests$.subscribe(userInterests => {
      if (userInterests !== null) {
        this.userProfileInterests = userInterests;
        this.userInterests.forEach(interestDetails => {
          const interestKey = interestDetails.key;
          interestDetails.value =
            userInterests[interestKey as keyof UserInterestsDTO];
        });
      }
    });

    this.subscriptions.add(userInterestsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateInterestSelection(userInterest: any): void {
    this.userInterests
      .filter(interest => interest.key === userInterest.key)
      .map(interest => {
        const selection: string = interest.value;
        const update = selection === 'Selected' ? 'Not selected' : 'Selected';
        interest.value = update;
      });
  }

  public updateUserProfileInterests(): void {
    const profileInterests: UserInterestsDTO = { ...this.userProfileInterests };
    this.userInterests.forEach(interest => {
      profileInterests[interest.key as keyof UserInterestsDTO] = interest.value;
    });

    if (profileInterests === this.userProfileInterests) {
      const appResponse: AppResponse = {
        viewed: false,
        type: AppResponseType.warning,
        messages: [
          this.translator.instant(
            ''
            // Need to add text to propertied file
          ),
        ],
      };

      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
    }

    this.store.dispatch(
      updateUserInterests({ userInterests: profileInterests })
    );
  }
}
