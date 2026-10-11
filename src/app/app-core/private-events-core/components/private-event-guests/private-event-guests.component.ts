import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PrivateEventGuestDTO } from '@app-core/private-events-core/api';
import { UserTokenDTO } from '@app-core/user-profile-core/api';

import {
  AppResponseType,
  ComponentAction,
  Device,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  privateEventGuestsSelector,
  privateEventActionSelector,
  updatePrivateEventGuests,
  retrievePrivateEventGuests,
  createPrivateEventGuest,
  removePrivateEventGuest,
} from '@private-events-core/store/create-edit-event';
import { PrivateEventAction } from '@private-events-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import { AppResponseService } from '@domain-services/index';
import { UserSearch } from '@user-profile-core/data-models';

enum DisplayPanel {
  guest_list = 'GUEST_LIST',
  user_socials = 'USER_SOCIALS',
}

@Component({
  selector: 'Tsk-private-event-guests',
  templateUrl: './private-event-guests.component.html',
  styleUrls: ['./private-event-guests.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventGuestsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public actionsOptions: typeof ComponentAction = ComponentAction;

  public displayPanel: string = DisplayPanel.user_socials;
  public displayOptions: typeof DisplayPanel = DisplayPanel;

  public controlIcon: string =
    this.displayPanel === this.displayOptions.guest_list ? 'add' : 'notes';
  public userSearch: UserSearch = UserSearch.user_socials;
  public userTokens: UserTokenDTO[] = [];

  private privateEventAction: PrivateEventAction;
  private eventGuests: PrivateEventGuestDTO[] = [];
  private profileDTO: ProfileDTO;

  private privateEventGuests$: Observable<PrivateEventGuestDTO[]> =
    this.store.select(privateEventGuestsSelector);
  private privateEventAction$: Observable<PrivateEventAction> =
    this.store.select(privateEventActionSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventGuestsSub = this.privateEventGuests$.subscribe(eventGuests => {
      this.eventGuests = [...eventGuests];

      const userTokens: UserTokenDTO[] = eventGuests.map(
        guest => guest.userToken
      );

      this.userTokens = [...userTokens];

      if (eventGuests.length >= 1) {
        this.displayPanel = DisplayPanel.guest_list;
      }
    });

    this.subscriptions.add(eventGuestsSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEventAction => {
        this.privateEventAction = privateEventAction;
        if (this.privateEventAction === PrivateEventAction.edit_event) {
          this.store.dispatch(
            retrievePrivateEventGuests({ profileDTO: this.profileDTO })
          );
        }
      }
    );

    this.subscriptions.add(privateEventActionSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateDisplayPanel(): void {
    if (this.displayPanel === this.displayOptions.guest_list) {
      this.displayPanel = this.displayOptions.user_socials;
      this.controlIcon = 'filter_list';
    } else if (this.displayPanel === this.displayOptions.user_socials) {
      this.displayPanel = this.displayOptions.guest_list;
      this.controlIcon = 'add';
    }
  }

  public appendEventGuest(userTokenDTO: UserTokenDTO): void {
    const eventGuest: PrivateEventGuestDTO = {
      userToken: userTokenDTO,
    };

    const duplicate: boolean = this.eventGuests.some(
      eventGuest =>
        eventGuest.userToken.userProfileId === userTokenDTO.userProfileId
    );

    if (duplicate) {
      const messages: string[] = [
        'private-event-dashboard.api-errors.duplicate-event-guest',
      ];
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
      return;
    }

    if (this.privateEventAction === PrivateEventAction.create_event) {
      const eventGuests: PrivateEventGuestDTO[] = [
        ...this.eventGuests,
        eventGuest,
      ];

      this.store.dispatch(
        updatePrivateEventGuests({ eventGuests: eventGuests })
      );
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      eventGuest.eventId = this.profileDTO.profileId;
      this.store.dispatch(
        createPrivateEventGuest({
          eventGuest: eventGuest,
          profileDTO: this.profileDTO,
        })
      );
    }
  }

  public removeEventGuest(userTokenDTO: UserTokenDTO): void {
    if (this.privateEventAction === PrivateEventAction.create_event) {
      const eventGuests: PrivateEventGuestDTO[] = this.eventGuests.filter(
        guest => {
          const userToken = guest.userToken;
          return userToken.userProfileId !== userTokenDTO.userProfileId;
        }
      );
      this.store.dispatch(
        updatePrivateEventGuests({ eventGuests: eventGuests })
      );
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      const eventGuest: PrivateEventGuestDTO = this.eventGuests.find(
        guest => guest.userToken.userProfileId === userTokenDTO.userProfileId
      );

      this.store.dispatch(
        removePrivateEventGuest({
          eventGuest: eventGuest,
          profileDTO: this.profileDTO,
        })
      );
    }
  }
}
