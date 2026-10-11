import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  eventGuestsSelector,
  retrieveEventGuests,
} from '@private-events-core/store';
import { UserTokenDTO } from '@user-profile-core/api';

@Component({
  selector: 'Tsk-event-guests',
  templateUrl: './event-guests.component.html',
  styleUrls: ['./event-guests.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventGuestsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public eventGuests: UserTokenDTO[] = [];

  private profileDTO: ProfileDTO;

  private eventGuests$: Observable<UserTokenDTO[]> =
    this.store.select(eventGuestsSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
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

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveEventGuests({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventGuestsSub = this.eventGuests$.subscribe(eventGuests => {
      if (eventGuests.length >= 1) {
        this.eventGuests = [...eventGuests];
      }
    });

    this.subscriptions.add(eventGuestsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
