import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  retrieveConversation,
  retrieveUserNotifications,
  storeRecentMessages,
  storeUserNotifications,
  storeConversation,
  evaluateNotificationsToken,
  retrieveRecentMessages,
  updateNotificationStatus,
  deleteUserNotification,
  updateUserNotifications,
  retrieveEventPosts,
  storeEventPosts,
} from '@communications-core/store';
import { catchError, concatMap, EMPTY, map } from 'rxjs';
import { CommunicationsApiService } from '@communications-core/api/api-service/communications-api.service';
import { ApiResponseService } from '@app-core/app-api';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationAction } from '@communications-core/data-models';

@Injectable()
export class CommunicationsEffects {
  public evaluateNotificationsTokenEffect = createEffect(
    () =>
      this.actions.pipe(
        ofType(evaluateNotificationsToken),
        concatMap(action =>
          this.communicationsApiService
            .evaluateNotificationToken(action.notificationToken)
            .pipe(catchError(() => EMPTY))
        )
      ),
    { dispatch: false }
  );

  public retrieveUserNotificationsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserNotifications),
      concatMap(() =>
        this.communicationsApiService.retrieveUserNotifications().pipe(
          map(userNotifications =>
            storeUserNotifications({ userNotifications: userNotifications })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public updateNotificationStatusEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateNotificationStatus),
      concatMap(action =>
        this.communicationsApiService
          .updateNotificationStatus(action.resourceReference)
          .pipe(
            map(() =>
              updateUserNotifications({
                action: NotificationAction.update_status,
                resourceReference: action.resourceReference,
              })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public deleteUserNotificationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(deleteUserNotification),
      concatMap(action =>
        this.communicationsApiService
          .deleteUserNotification(action.resourceReference)
          .pipe(
            map(() =>
              updateUserNotifications({
                action: NotificationAction.delete_notification,
                resourceReference: action.resourceReference,
              })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveRecentMessagesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveRecentMessages),
      concatMap(() =>
        this.communicationsApiService.retrieveRecentMessages().pipe(
          map(recentMessages =>
            storeRecentMessages({ recentMessages: recentMessages })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveConversationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveConversation),
      concatMap(action =>
        this.communicationsApiService
          .retrieveConversation(action.conversationDTO)
          .pipe(
            map(conversation =>
              storeConversation({ conversation: conversation })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveEventPostsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventPosts),
      concatMap(action =>
        this.communicationsApiService
          .retrieveEventPosts(action.eventType, action.eventReferenceId)
          .pipe(
            map(eventPosts => storeEventPosts({ eventPosts: eventPosts })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );
  constructor(
    private actions: Actions,
    private communicationsApiService: CommunicationsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
