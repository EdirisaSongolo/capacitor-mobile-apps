import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Device, RequestStatus } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  LocationTokenDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@public-events-core/api';
import {
  EventStaffDisplay,
  PublicEventAction,
} from '@app-core/public-events-core/data-models';
import {
  eventLocationsSelector,
  publicEventProfileImageSelector,
  publicEventActionSelector,
  retrievePublicEventLocations,
  setEventStaffDisplay,
  setPublicEventLocation,
  staffDisplaySelector,
  updateEventLocations,
} from '@app-core/public-events-core/store/create-edit-event';

import {
  ProfileDTO,
  ProviderRequestDTO,
} from '@app-core/app-api/app-api.dto-models';
import { profileDTOSelector } from '@app-domain/store';
import { PublicEventMappersService } from '@public-events-core/services';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { ServiceProviderDTO } from '@profile-accounts-core/api';

@Component({
  selector: 'Tsk-public-event-staff',
  templateUrl: './public-event-staff.component.html',
  styleUrls: ['./public-event-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventStaffComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public staffDisplay: EventStaffDisplay = EventStaffDisplay.event_locations;
  public displayOptions: typeof EventStaffDisplay = EventStaffDisplay;

  public profileImage: string | File;
  public locationsTokens: LocationTokenDTO[] = [];

  private publicEventLocation: PublicEventLocationDTO;

  private profile$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private eventLocations: PublicEventLocationDTO[] = [];
  private eventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private staffDisplay$: Observable<EventStaffDisplay> =
    this.store.select(staffDisplaySelector);
  private eventLocations$: Observable<PublicEventLocationDTO[]> =
    this.store.select(eventLocationsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private publicEventMappers: PublicEventMappersService,
    private profileMappers: ProfileMapperService
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

    const actionProfileSub = combineLatest([
      this.eventAction$,
      this.profile$,
    ]).subscribe(([eventAction, profile]) => {
      if (eventAction && profile) {
        if (eventAction === PublicEventAction.edit_event) {
          this.store.dispatch(
            retrievePublicEventLocations({ profileDTO: profile })
          );
        }
      }
    });

    this.subscriptions.add(actionProfileSub);

    const eventLocationsSub = this.eventLocations$.subscribe(eventLocations => {
      if (eventLocations.length >= 1) {
        this.eventLocations = [...eventLocations];
        this.locationsTokens = this.eventLocations.flatMap(location =>
          this.publicEventMappers.locationTokenDTOMapper(location)
        );
      }
    });

    this.subscriptions.add(eventLocationsSub);

    const staffDisplaySub = this.staffDisplay$.subscribe(staffDisplay => {
      this.staffDisplay = staffDisplay;
    });

    this.subscriptions.add(staffDisplaySub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public setPublicEventLocation(locationToken: LocationTokenDTO): void {
    this.publicEventLocation = this.eventLocations.find(
      location => location.locationId === locationToken.locationId
    );

    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: this.publicEventLocation })
    );

    this.store.dispatch(
      setEventStaffDisplay({
        staffDisplay: EventStaffDisplay.create_edit_staff,
      })
    );
  }

  public appendEventLocationStaff(
    providerRequests: ProviderRequestDTO[]
  ): void {
    const locationDates = this.publicEventLocation.eventDates;
    const updatedLocationDates: PublicEventDateDTO[] = [];

    for (const locationDate of locationDates) {
      const dateStaff: ServiceProviderDTO[] = [];
      providerRequests.forEach(providerRequest => {
        if (providerRequest.referenceId === locationDate.dateId) {
          const provider = providerRequest.provider;
          const serviceProvider: ServiceProviderDTO =
            this.profileMappers.profileToServiceProviderDTO(provider);
          dateStaff.push(serviceProvider);
        }
      });
      const staffList = locationDate?.dateStaff
        ? [...locationDate.dateStaff]
        : [];
      staffList.push(...dateStaff);

      const updatedDate: PublicEventDateDTO = {
        ...locationDate,
        dateStaff: [...staffList],
      };
      updatedLocationDates.push(updatedDate);
    }

    this.publicEventLocation = {
      ...this.publicEventLocation,
      eventDates: [...updatedLocationDates],
    };

    this.updatePublicEventLocations(this.publicEventLocation);
  }

  public updateEventLocationStaff(
    providerRequests: ProviderRequestDTO[]
  ): void {
    const locationDates = this.publicEventLocation.eventDates;

    for (const locationDate of locationDates) {
      let dateStaff = locationDate.dateStaff;

      providerRequests.forEach(providerRequest => {
        if (providerRequest.referenceId === locationDate.dateId) {
          if (providerRequest.requestStatus === RequestStatus.pending) {
            const provider = providerRequest.provider;
            const serviceProvider: ServiceProviderDTO =
              this.profileMappers.profileToServiceProviderDTO(provider);
            dateStaff.push(serviceProvider);
          } else if (
            providerRequest.requestStatus === RequestStatus.cancelled
          ) {
            const provider = providerRequest.provider;
            const profileDTOs: ProfileDTO[] = dateStaff.map(staff =>
              this.profileMappers.serviceProviderToProfileDTO(staff)
            );

            const staffList = profileDTOs.filter(
              staff => staff.profileId !== provider.profileId
            );

            const serviceProviders = staffList.map(staff =>
              this.profileMappers.profileToServiceProviderDTO(staff)
            );

            dateStaff = [...serviceProviders];
          }
        }
      });

      this.updatePublicEventLocations(this.publicEventLocation);
    }
  }

  private updatePublicEventLocations(
    publicEventLocation: PublicEventLocationDTO
  ): void {
    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: publicEventLocation })
    );

    const eventLocations = [...this.eventLocations];
    const locationIndex: number = eventLocations.findIndex(
      location => location.locationId === publicEventLocation.locationId
    );
    eventLocations[locationIndex] = publicEventLocation;

    this.store.dispatch(
      updateEventLocations({ eventLocations: eventLocations })
    );
  }
}
