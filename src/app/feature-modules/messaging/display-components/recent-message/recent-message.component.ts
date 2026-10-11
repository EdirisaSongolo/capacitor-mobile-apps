import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import { UserProfileConstants } from '@app-core/user-profile-core/data-models';
import { ChatProfileDTO, MessageDTO } from '@app-core/communications-core';
import { userProfileInfoSelector } from '@core-modules';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'Tsk-recent-message',
  templateUrl: './recent-message.component.html',
  styleUrls: ['./recent-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RecentMessageComponent implements OnInit, OnDestroy {
  @Input() public recentMessage: MessageDTO;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public chatImage: string;
  public chatName: string;

  public chatProfiles: ChatProfileDTO[];
  public userProfileImage: string;
  public userName: string;

  private userId: string;
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
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        this.userId = userProfileInfo.userProfileId;
        if (this.recentMessage) {
          this.processRecentMessage();
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private processRecentMessage(): void {
    this.chatProfiles = this.recentMessage.chatProfiles;

    if (this.chatProfiles?.length === 2) {
      const contact: ChatProfileDTO = this.chatProfiles.find(
        user => user.userProfileId !== this.userId
      );

      const imagePath = contact?.profileImage;
      this.chatImage = imagePath
        ? `url(${imagePath}) center / contain no-repeat`
        : `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
      this.chatName = contact.userName;
    } else if (this.chatProfiles?.length > 2) {
      this.chatImage = '';
      this.chatName = '';
    }
  }
}
