import { inject, NgModule } from '@angular/core';
import { RedirectFunction, RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { authGuard } from '@app-core/app-domain/guards';
import { AppMainComponent } from '@app-main/app-main/app-main.component';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { AppResponseType } from '@domain-data-models/app-domain.enums';

const pageNotFoundRedirect: RedirectFunction = () => {
  const translator = inject(TranslateService);
  const appResponseService = inject(AppResponseService);

  translator
    .get('page-not-found')
    .pipe(take(1))
    .subscribe(() =>
      appResponseService.createAppResponse(AppResponseType.warning, [
        'page-not-found',
      ])
    );

  return '/public-events';
};

const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@public-events/public-events.module').then(
            mod => mod.PublicEventsModule
          ),
      },
      {
        path: 'public-event-profile/:publicEventId',
        loadChildren: () =>
          import('@public-event-profile/public-event-profile.module').then(
            mod => mod.PublicEventProfileModule
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@app-auth/app-auth.module').then(mod => mod.AppAuthModule),
      },
      {
        path: 'dash-board',
        loadChildren: () =>
          import('@dash-board/dash-board.module').then(
            mod => mod.DashBoardModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'create-event',
        loadChildren: () =>
          import('@create-event/create-event.module').then(
            mod => mod.CreateEventModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'venues',
        loadChildren: () =>
          import('@venues/venues.module').then(mod => mod.VenuesModule),
      },
      {
        path: 'venue-profile/:venueProfileId',
        loadChildren: () =>
          import('@venue-profile/venue-profile.module').then(
            mod => mod.VenueProfileModule
          ),
      },
      {
        path: 'service-providers',
        loadChildren: () =>
          import('@service-providers/service-providers.module').then(
            mod => mod.ServiceProvidersModule
          ),
      },
      {
        path: 'user-profile/:userProfileId',
        loadChildren: () =>
          import('@user-profile/user-profile.module').then(
            mod => mod.UserProfileModule
          ),
      },
      {
        path: 'vendor-profile/:vendorProfileId',
        loadChildren: () =>
          import('@vendor-profile/vendor-profile.module').then(
            mod => mod.VendorProfileModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('@user-account/user-account.module').then(
            mod => mod.UserAccountModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'user-public-event/:publicEventDateId',
        loadChildren: () =>
          import('@user-public-event/user-public-event.module').then(
            mod => mod.UserPublicEventModule
          ),
      },
      {
        path: 'user-private-event/:privateEventId',
        loadChildren: () =>
          import('@user-private-event/user-private-event.module').then(
            mod => mod.UserPrivateEventModule
          ),
      },

      {
        path: 'messaging',
        loadChildren: () =>
          import('@messaging/messaging.module').then(
            mod => mod.MessagingModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('@notifications/notifications.module').then(
            mod => mod.NotificationsModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'search',
        loadChildren: () =>
          import('@search/search.module').then(mod => mod.SearchModule),
      },
      {
        path: '**',
        redirectTo: pageNotFoundRedirect,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppMainRoutingModule {}
