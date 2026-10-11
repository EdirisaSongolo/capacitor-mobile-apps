import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '@auth-core/auth-service';
import { AuthDTO } from '@auth-core/api';
import { EventPostDTO, MessageDTO } from '@communications-core/api';
import { Store } from '@ngrx/store';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subscription } from 'rxjs';
import { ApiRestConstants } from '@app-core/app-api/app-api.rest-constants';
import { AppDomainConstants } from '@domain-data-models/app-domain.constants';
import {
  appendEventPost,
  updateConversation,
  updateRecentMessages,
} from '@app-core/communications-core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private stompClient: Client | null = null;
  private sockerUrl = `${ApiRestConstants.API_INGRESS}/${ApiRestConstants.TUUSKA}/${ApiRestConstants.API}/${ApiRestConstants.MESSAGING}`;

  private messagesDestination: string = `/${ApiRestConstants.MESSAGE_HANDLER}/${ApiRestConstants.SEND_USER_MESSAGE}`;
  private userName: string | null = null;
  private userMessagesSubscription: StompSubscription | null = null;

  private postsDestination: string = `/${ApiRestConstants.MESSAGE_HANDLER}/${ApiRestConstants.SEND_EVENT_POST}`;
  private postsReferenceId: string | null = null;
  private postsSubscription: StompSubscription | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private store: Store
  ) {
    const userNameSub = this.authService
      .retrieveUserName()
      .subscribe(userName => {
        this.userName = userName;
      });

    this.subscriptions.add(userNameSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public connect(): void {
    if (this.stompClient?.active) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(this.sockerUrl),
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
    });

    client.beforeConnect = () => {
      const clientTokens: AuthDTO = this.authService.retrieveClientTokens();
      client.connectHeaders = {
        [AppDomainConstants.ACCESS_TOKEN]: clientTokens.accessToken,
        [AppDomainConstants.REFRESH_TOKEN]: clientTokens.refreshToken,
      };
    };

    client.onConnect = event => {
      if (client !== this.stompClient) {
        return;
      }
      this.subscribeToUserMessages(client);
      this.subscribeToEventPosts(client);
    };

    client.onStompError = event => {
      console.error('WebSocket error: ', event);
    };

    client.onDisconnect = event => {
      console.log('WebSocket connection closed:', event);
    };

    this.stompClient = client;
    this.stompClient.activate();
  }

  public disconnect(): void {
    this.userMessagesSubscription = null;
    this.postsSubscription = null;

    const client = this.stompClient;
    this.stompClient = null;
    client?.deactivate();
  }

  public sendMessage(message: MessageDTO): boolean {
    if (!this.stompClient?.connected) {
      return false;
    }

    const recepient = this.messagesDestination;
    this.stompClient.publish({
      destination: recepient,
      body: JSON.stringify(message),
    });
    return true;
  }

  public sendEventPost(eventPost: EventPostDTO): boolean {
    if (!this.stompClient?.connected) {
      return false;
    }

    this.stompClient.publish({
      destination: this.postsDestination,
      body: JSON.stringify(eventPost),
    });
    return true;
  }

  public subscribeEventPosts(eventReferenceId: string): void {
    this.postsReferenceId = eventReferenceId;

    if (this.stompClient?.connected) {
      this.subscribeToEventPosts(this.stompClient);
    }
  }

  public unsubscribeEventPosts(): void {
    this.postsReferenceId = null;
    this.postsSubscription?.unsubscribe();
    this.postsSubscription = null;
  }

  private subscribeToUserMessages(client: Client): void {
    this.userMessagesSubscription?.unsubscribe();
    this.userMessagesSubscription = null;

    if (!this.userName) {
      return;
    }

    const userMessages: string = `/${ApiRestConstants.USER}/${this.userName}/${ApiRestConstants.QUEUE}/${ApiRestConstants.USER_MESSAGES}`;
    this.userMessagesSubscription = client.subscribe(
      userMessages,
      userMessage => {
        const message = JSON.parse(userMessage.body) as MessageDTO;
        this.store.dispatch(updateConversation({ message }));
        this.store.dispatch(updateRecentMessages({ message }));
      }
    );
  }

  private subscribeToEventPosts(client: Client): void {
    this.postsSubscription?.unsubscribe();
    this.postsSubscription = null;

    if (!this.postsReferenceId) {
      return;
    }

    const eventPosts: string = `/${ApiRestConstants.TOPIC}/${ApiRestConstants.EVENT_POSTS}/${this.postsReferenceId}`;
    this.postsSubscription = client.subscribe(eventPosts, eventPost => {
      const post = JSON.parse(eventPost.body) as EventPostDTO;
      this.store.dispatch(appendEventPost({ eventPost: post }));
    });
  }
}
