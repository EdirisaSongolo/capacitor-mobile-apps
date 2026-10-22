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
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  EventComponentDTO,
  LocationTokenDTO,
  PublicEventLocationDTO,
} from '@public-events-core/api';
import { EventComponents } from '@public-events-core/data-models';
import {
  eventLocationsSelector,
  publicEventProfileImageSelector,
  retrievePublicEventLocation,
  retrievePublicEventLocations,
} from '@public-events-core/store';
import { PublicEventMappersService } from '@public-events-core/services';

enum GatePersonnelLocationsDisplay {
  event_locations = 'EVENT_LOCATIONS',
  create_edit_personnel = 'CREATE_EDIT_PERSONNEL',
}

@Component({
  selector: 'Tsk-gate-personel',
  templateUrl: './gate-personel.component.html',
  styleUrls: ['./gate-personel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GatePersonelComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayOptions: typeof GatePersonnelLocationsDisplay =
    GatePersonnelLocationsDisplay;
  public locationsDisplay: GatePersonnelLocationsDisplay =
    GatePersonnelLocationsDisplay.event_locations;

  public profileImage: string | File;
  public locationsTokens: LocationTokenDTO[] = [];

  private eventLocations: PublicEventLocationDTO[] = [];

  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private eventLocations$: Observable<PublicEventLocationDTO[]> =
    this.store.select(eventLocationsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private publicEventMappers: PublicEventMappersService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileImageSub = this.profileImage$.subscribe(profileImage => {
      if (profileImage) {
        this.profileImage = profileImage;
      }
    });

    this.subscriptions.add(profileImageSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.store.dispatch(
          retrievePublicEventLocations({ profileDTO: profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventLocationsSub = this.eventLocations$.subscribe(eventLocations => {
      if (eventLocations?.length >= 1) {
        this.eventLocations = [...eventLocations];
        this.locationsTokens = this.eventLocations.flatMap(location =>
          this.publicEventMappers.locationTokenDTOMapper(location)
        );
      }
    });

    this.subscriptions.add(eventLocationsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public setPublicEventLocation(locationToken: LocationTokenDTO): void {
    const eventLocation: EventComponentDTO = {
      component: EventComponents.event_location,
      componentId: locationToken.locationId,
    };

    this.store.dispatch(
      retrievePublicEventLocation({ eventComponent: eventLocation })
    );

    this.locationsDisplay = this.displayOptions.create_edit_personnel;
  }
}
