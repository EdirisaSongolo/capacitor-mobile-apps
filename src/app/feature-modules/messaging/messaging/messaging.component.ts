import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';

import {
  chatContactsSelector,
  recentMessagesSelector,
  retrieveRecentMessages,
} from '@communications-core/store';
import {
  ChatProfileDTO,
  ConversationDTO,
  MessageDTO,
} from '@communications-core/api';
import { UserTokenDTO } from '@app-core/user-profile-core/api';
import { MessagingDisplay } from '@app-core/communications-core/data-models';
import { userProfileInfoSelector } from '@core-modules';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';

@Component({
  selector: 'Tsk-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MessagingComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public controls: any = {
    recents: 'mark_chat_unread',
    socials: 'menu',
  };

  public messagingDisplay: MessagingDisplay = MessagingDisplay.socials;
  public displayPanels: typeof MessagingDisplay = MessagingDisplay;

  public recentMessages: MessageDTO[] = [];
  public conversationToken: ConversationDTO;

  private userChatProfile: ChatProfileDTO;
  private chatContacts: ChatProfileDTO[] = [];

  private recentMessages$: Observable<MessageDTO[]> = this.store.select(
    recentMessagesSelector
  );
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private chatContacts$: Observable<ChatProfileDTO[]> =
    this.store.select(chatContactsSelector);
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
        if (userProfileInfo?.userProfileId) {
          this.userChatProfile = {
            userProfileId: userProfileInfo.userProfileId,
            profileImage: userProfileInfo.profileImage,
            userName: userProfileInfo.userName,
          };

          this.store.dispatch(retrieveRecentMessages());
          this.displayContactChat();
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const recentMessagesSub = this.recentMessages$.subscribe(recentMessages => {
      if (recentMessages && recentMessages.length >= 1) {
        this.recentMessages = [...recentMessages];
        if (this.messagingDisplay !== this.displayPanels.chat) {
          this.messagingDisplay = this.displayPanels.recents;
        }
      }
    });

    this.subscriptions.add(recentMessagesSub);

    const chatContactsSub = this.chatContacts$.subscribe(chatContacts => {
      this.chatContacts = chatContacts ?? [];
      this.displayContactChat();
    });

    this.subscriptions.add(chatContactsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayConversationChat(recentMessage: MessageDTO): void {
    this.conversationToken = {
      conversationId: recentMessage.conversationId,
      chatProfiles: [],
      messages: [],
    };

    this.messagingDisplay = MessagingDisplay.chat;
  }

  public displayUserContactChat(userTokenDTO: UserTokenDTO): void {
    const contactChatProfile: ChatProfileDTO = {
      userProfileId: userTokenDTO.userProfileId,
      profileImage: userTokenDTO.profileImage,
      userName: userTokenDTO.userName,
    };

    this.conversationToken = {
      conversationId: null,
      chatProfiles: [contactChatProfile, this.userChatProfile],
      messages: [],
    };

    this.messagingDisplay = MessagingDisplay.chat;
  }

  public displayContactsPanel(): void {
    if (this.recentMessages && this.recentMessages.length >= 1) {
      this.messagingDisplay = MessagingDisplay.recents;
    } else {
      this.messagingDisplay = MessagingDisplay.socials;
    }
  }

  public displayRecentMessages(): void {
    this.messagingDisplay = MessagingDisplay.recents;
    this.store.dispatch(retrieveRecentMessages());
  }

  public displayUserSocials(): void {
    this.messagingDisplay = MessagingDisplay.socials;
  }

  private displayContactChat(): void {
    if (this.chatContacts.length === 0 || !this.userChatProfile) return;

    this.conversationToken = {
      conversationId: null,
      chatProfiles: [...this.chatContacts, this.userChatProfile],
      messages: [],
    };

    this.messagingDisplay = MessagingDisplay.chat;
  }
}
