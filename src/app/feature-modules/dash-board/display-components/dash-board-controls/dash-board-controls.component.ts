import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device, Profiles } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import {
  SocialsDisplay,
  UserProfileConstants,
} from '@user-profile-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { updateProfileImage } from '@media-core/store';
import { MediaDesignation } from '@media-core/data-models';
import { FilePickerService } from '@media-core/services/file-picker/file-picker.service';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { userProfileInfoSelector } from '@core-modules';
import { updateSocialsDisplay } from '@user-profile-core/store';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';

@Component({
  selector: 'Tsk-dash-board-controls',
  templateUrl: './dash-board-controls.component.html',
  styleUrls: ['./dash-board-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DashBoardControlsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public socialsDisplays: typeof SocialsDisplay = SocialsDisplay;

  public userProfileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public apps: string = 'crop_free';
  public userProfileInfo: UserProfileInfo;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private filePickerService: FilePickerService
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

  public userProfileDashboard(): void {
    this.router.navigate([
      `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.USER_PROFILE}`,
    ]);
  }

  public socialsDashboard(socialsDisplay: SocialsDisplay): void {
    this.router.navigate([
      `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.SOCIALS}`,
    ]);
    this.store.dispatch(
      updateSocialsDisplay({ socialsDisplay: socialsDisplay })
    );
  }

  public displayDashboardApps(): void {
    this.router.navigate([
      `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.DASH_BOARD_APPS}`,
    ]);
  }

  public async updateUserProfileImage(): Promise<void> {
    const [profileImageFile] = await this.filePickerService.selectImageFiles(
      MediaDesignation.profile_image
    );
    if (!profileImageFile) {
      return;
    }

    const profile: ProfileDTO = {
      profile: Profiles.userProfile,
      profileId: this.userProfileInfo.userProfileId,
    };

    this.store.dispatch(
      updateProfileImage({ profile: profile, profileImage: profileImageFile })
    );
  }

  private processProfileImage(): void {
    if (this.userProfileInfo && this.userProfileInfo?.profileImage !== null) {
      const imagePath = this.userProfileInfo.profileImage;
      this.userProfileImage = `url(${imagePath}) center center / contain no-repeat`;
    }
  }
}
