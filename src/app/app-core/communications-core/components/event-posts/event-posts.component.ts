import {
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
import { userProfileInfoSelector } from '@app-store/app.selectors';
import {
  AppResponseType,
  Device,
  EventTypes,
} from '@domain-data-models/app-domain.enums';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { ChatProfileDTO, EventPostDTO } from '@communications-core/api';
import { MessageType } from '@communications-core/data-models';
import { PostAccessService } from '@communications-core/services';
import { WebSocketService } from '@app-core/app-api/web-socket/web-socket.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  eventPostsSelector,
  retrieveEventPosts,
  storeEventPosts,
} from '@communications-core/store';

@Component({
  selector: 'Tsk-event-posts',
  styleUrls: ['./event-posts.component.scss'],
  templateUrl: './event-posts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventPostsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public eventType: EventTypes;
  @Input() public eventReferenceId: string;

  @ViewChild('posts_container') public posts_container: ElementRef;
  @ViewChild('text_area') public text_area: ElementRef;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public sendIcon: string = 'chevron_right';

  public userProfileId: string;
  private senderProfile: ChatProfileDTO;
  public postAccess: boolean = false;
  public eventPosts: EventPostDTO[] = [];
  public postForm: FormGroup = this.formBuilder.group({
    post: ['', Validators.required],
  });

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private postAccess$: Observable<boolean> =
    this.postAccessService.userPostAccess.asObservable();
  private eventPosts$: Observable<EventPostDTO[]> =
    this.store.select(eventPostsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    public formBuilder: FormBuilder,
    private postAccessService: PostAccessService,
    private websocketService: WebSocketService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(storeEventPosts({ eventPosts: [] }));

    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo?.userProfileId) {
          this.userProfileId = userProfileInfo.userProfileId;
          this.senderProfile = {
            userProfileId: userProfileInfo.userProfileId,
            profileImage: userProfileInfo.profileImage,
            userName: userProfileInfo.userName,
          };
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    if (this.eventType === EventTypes.privateEvent) {
      this.postAccess = true;
    } else {
      const postAccessSub = this.postAccess$.subscribe(postAccess => {
        this.postAccess = postAccess;
      });

      this.subscriptions.add(postAccessSub);
    }

    const eventPostsSub = this.eventPosts$.subscribe(eventPosts => {
      if (eventPosts) {
        this.processEventPosts(eventPosts);
      }
    });

    this.subscriptions.add(eventPostsSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['eventReferenceId'] &&
      changes['eventReferenceId'].currentValue
    ) {
      this.store.dispatch(
        retrieveEventPosts({
          eventType: this.eventType,
          eventReferenceId: this.eventReferenceId,
        })
      );
      this.websocketService.subscribeEventPosts(this.eventReferenceId);
    }
  }

  public ngOnDestroy(): void {
    this.postAccessService.userPostAccess.next(false);
    this.websocketService.unsubscribeEventPosts();
    this.subscriptions.unsubscribe();
  }

  public sendEventPost(): void {
    if (this.postForm.invalid) {
      return;
    }

    const eventPost: EventPostDTO = {
      eventType: this.eventType,
      eventReferenceId: this.eventReferenceId,
      senderUserId: this.userProfileId,
      senderProfile: this.senderProfile,
      messageType: MessageType.text,
      post: this.postForm.value?.post,
    };

    const sent: boolean = this.websocketService.sendEventPost(eventPost);

    if (!sent) {
      const messages: string[] = ['messaging.connection-lost'];
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
      return;
    }

    this.postForm.reset();
  }

  private processEventPosts(eventPosts: EventPostDTO[]): void {
    this.eventPosts = [...eventPosts].reverse();
  }
}
