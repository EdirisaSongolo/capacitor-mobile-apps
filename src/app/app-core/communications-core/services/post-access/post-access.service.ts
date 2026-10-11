import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ProfileDTO } from '@app-core/app-api';
import { userProfileInfoSelector } from '@app-store/app.selectors';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { ProfileMapperService } from '@profile-accounts-core/services';
import {
  managedProfilesSelector,
  retrieveManagedProfiles,
} from '@profile-accounts-core/store';
import {
  publicEventFeaturesSelector,
  publicEventPrincipalSelector,
} from '@public-events-core/store';

@Injectable({
  providedIn: 'root',
})
export class PostAccessService implements OnDestroy {
  public userPostAccess: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private userProfileId: string;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private eventPrincipal$: Observable<ServiceProviderDTO> = this.store.select(
    publicEventPrincipalSelector
  );
  private eventFeatures$: Observable<ServiceProviderDTO[]> = this.store.select(
    publicEventFeaturesSelector
  );
  private managedProfiles$: Observable<ServiceProviderDTO[]> =
    this.store.select(managedProfilesSelector);
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private profileMapperService: ProfileMapperService
  ) {
    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo?.userProfileId) {
          this.userProfileId = userProfileInfo.userProfileId;
          this.store.dispatch(retrieveManagedProfiles());
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const profilesSub = combineLatest([
      this.eventPrincipal$,
      this.eventFeatures$,
      this.managedProfiles$,
    ]).subscribe(([principal, features, managedProfiles]) => {
      if (principal && features && managedProfiles) {
        this.updatePostAccess(principal, features, managedProfiles);
      }
    });

    this.subscriptions.add(profilesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updatePostAccess(
    principal?: ServiceProviderDTO,
    features?: ServiceProviderDTO[],
    managedProfiles?: ServiceProviderDTO[]
  ): void {
    if (!principal || !features || !managedProfiles) {
      return;
    }

    const featureIds: string[] = features.map(
      feature =>
        this.profileMapperService.serviceProviderToProfileDTO(feature).profileId
    );

    if (featureIds.includes(this.userProfileId)) {
      this.userPostAccess.next(true);
      return;
    }

    if (managedProfiles.length === 0) return;

    const managedProfileIds: string[] = managedProfiles.map(
      serviceProvider =>
        this.profileMapperService.serviceProviderToProfileDTO(serviceProvider)
          .profileId
    );

    const principalProfileDTO: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(principal);
    if (managedProfileIds.includes(principalProfileDTO.profileId)) {
      this.userPostAccess.next(true);
      return;
    }

    const managesFeature: boolean = managedProfileIds.some(profileId =>
      featureIds.includes(profileId)
    );

    if (managesFeature) {
      this.userPostAccess.next(true);
    }
  }
}
