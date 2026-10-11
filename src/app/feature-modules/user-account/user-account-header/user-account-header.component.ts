import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import { AuthService } from '@auth-core/auth-service';
import {
  SocialsDisplay,
  UserProfileConstants,
} from '@user-profile-core/data-models';

import { userProfileInfoSelector } from '@core-modules';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';

@Component({
  selector: 'Tsk-user-account-header',
  templateUrl: './user-account-header.component.html',
  styleUrls: ['./user-account-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserAccountHeaderComponent implements OnInit, OnDestroy {
  @Output() public headerAction: EventEmitter<SocialsDisplay> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public socialsOptions: typeof SocialsDisplay = SocialsDisplay;

  public userProfileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public privateEvents: string = 'stream';

  public userProfileInfo: UserProfileInfo;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo.userProfileId) {
          this.userProfileInfo = { ...userProfileInfo };
          this.processProfileImage();
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayUserSocials(socialsOption: SocialsDisplay): void {
    this.headerAction.emit(socialsOption);
  }

  private processProfileImage(): void {
    if (this.userProfileInfo && this.userProfileInfo?.profileImage !== null) {
      const imagePath = this.userProfileInfo.profileImage;
      this.userProfileImage = `url(${imagePath}) center center / contain no-repeat`;
    }
  }
}
