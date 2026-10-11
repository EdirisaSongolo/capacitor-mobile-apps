import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BreakPointService } from '@domain-services/index';
import { WebSocketService } from '@app-core/app-api/web-socket/web-socket.service';
import {
  ChatProfileDTO,
  ConversationDTO,
  MessageDTO,
} from '@communications-core/api';
import {
  conversationSelector,
  retrieveConversation,
  storeConversation,
} from '@communications-core/store';
import { UserProfileConstants } from '@app-core/user-profile-core/data-models';
import { userProfileInfoSelector } from '@app-store/app.selectors';
import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { MessageType } from '@communications-core/data-models';

@Component({
  selector: 'Tsk-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChatComponent
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy
{
  @Input() public conversationToken: ConversationDTO;

  @ViewChild('messages_container') public messages_container: ElementRef;
  @ViewChild('text_area') public text_area: ElementRef;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public cropIcon: string = 'crop_free';
  public sendIcon: string = 'chevron_right';

  public userChatProfile: ChatProfileDTO;
  public chatImage: string;
  public chatName: string;
  public messages: MessageDTO[] = [];
  public maxLength = 69;
  public maxRows = 6;
  public messageForm: FormGroup = this.formBuilder.group({
    message: ['', Validators.required],
  });

  private conversation: ConversationDTO;

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private conversation$: Observable<ConversationDTO> =
    this.store.select(conversationSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    public formBuilder: FormBuilder,
    private websocketService: WebSocketService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(storeConversation({ conversation: null }));
    this.setTextFieldControls();

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
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const conversationSub = this.conversation$.subscribe(conversation => {
      if (conversation) {
        this.conversation = { ...conversation };
        this.processConversation(this.conversation);
      }
    });

    this.subscriptions.add(conversationSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['conversationToken'] &&
      changes['conversationToken'].currentValue
    ) {
      this.store.dispatch(
        retrieveConversation({ conversationDTO: this.conversationToken })
      );
    }
  }

  public ngAfterViewChecked(): void {
    this.messages_container.nativeElement.scrollTop =
      this.messages_container.nativeElement.scrollHeight;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public sendUserMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const message: MessageDTO = {
      conversationId: this.conversation.conversationId,
      senderUserId: this.userChatProfile.userProfileId,
      messageType: MessageType.text,
      message: this.messageForm.value?.message,
      chatProfiles: this.conversation.chatProfiles,
    };

    const sent: boolean = this.websocketService.sendMessage(message);

    if (!sent) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'messaging.connection-lost',
      ]);
      return;
    }

    this.messageForm.reset();
  }

  private setTextFieldControls(): void {
    this.messageForm.get('message').valueChanges.subscribe(values => {
      this.text_area.nativeElement.style.height = 'auto';
      this.text_area.nativeElement.style.height = `${this.text_area.nativeElement.scrollHeight}px`;

      if (this.text_area.nativeElement.scrollHeight >= 113) {
        this.text_area.nativeElement.value =
          this.text_area.nativeElement.value.slice(0, -1);
      }
    });
  }

  private processConversation(conversation: ConversationDTO): void {
    this.messages = [...conversation.messages].reverse();

    const chatProfiles = conversation.chatProfiles;
    if (chatProfiles.length === 2) {
      const recepient: ChatProfileDTO = chatProfiles.find(
        profile =>
          profile?.userProfileId !== this.userChatProfile?.userProfileId
      );

      const imagePath = recepient?.profileImage;
      this.chatImage = recepient?.profileImage
        ? `url(${imagePath}) center / contain no-repeat`
        : `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
      this.chatName = recepient?.userName;
    }
  }
}
