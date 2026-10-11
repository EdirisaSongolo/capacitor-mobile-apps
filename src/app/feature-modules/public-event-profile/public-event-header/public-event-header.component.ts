import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { LocationDTO, ProfileDTO } from '@app-core/app-api';
import { PublicEventConstants } from '@public-events-core/data-models';

import {
  PublicEventTokenDTO,
  TokenLocationDate,
} from '@public-events-core/api';
import {
  publicEventTokenSelector,
  retrievePublicEventToken,
} from '@public-events-core/store';
import { profileDTOSelector } from '@app-domain/store';

@Component({
  selector: 'Tsk-public-event-header',
  templateUrl: './public-event-header.component.html',
  styleUrls: ['./public-event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventHeaderComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `url(${PublicEventConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public publicEvent: PublicEventTokenDTO;

  public eventName: string;
  public eventLocation: string;
  public eventDescription: string;

  private profileDTO: ProfileDTO;
  private publicEventToken: PublicEventTokenDTO;

  private publicEventToken$: Observable<PublicEventTokenDTO> =
    this.store.select(publicEventTokenSelector);
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
          retrievePublicEventToken({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const publicEventSub = this.publicEventToken$.subscribe(
      publicEventToken => {
        if (publicEventToken) {
          this.publicEventToken = { ...publicEventToken };
          this.processPublicEvent(this.publicEventToken);
        }
      }
    );

    this.subscriptions.add(publicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private processPublicEvent(publicEventToken: PublicEventTokenDTO): void {
    this.eventName = this.publicEventToken.eventName;

    this.publicEvent = { ...publicEventToken };
    if (this.publicEvent?.profileImage) {
      const imagePath = this.publicEvent.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    const tokenLocationDate: TokenLocationDate =
      publicEventToken.tokenLocationDate;
    const locationDTO: LocationDTO = tokenLocationDate.eventLocation;
    const eventCity = locationDTO.city;
    const eventState = locationDTO.state;

    this.eventLocation = `${eventCity}, ${eventState}`;
    this.eventDescription = this.publicEvent.eventDescription;
  }
}
