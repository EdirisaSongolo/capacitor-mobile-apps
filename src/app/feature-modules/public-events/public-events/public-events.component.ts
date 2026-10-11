import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { LocationCategory } from '@domain-data-models/app-domain.interfaces';
import {
  LocationCategoriesDTO,
  LocationDTO,
  SearchDTO,
} from '@app-core/app-api/app-api.dto-models';
import {
  PublicEventCategories,
  PublicEventCategoriesList,
  PublicEventsDisplay,
  PublicEventRoutes,
} from '@public-events-core/data-models';
import {
  publicEventSearchSelector,
  publicEventsSelector,
  retrievePublicEvents,
  retrievePublicEventSearchResults,
} from '@public-events-core/store';
import { userLocationSelector } from '@app-store/app.selectors';
import { PublicEventTokenDTO } from '@app-core/public-events-core/api';

@Component({
  selector: 'Tsk-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppHomeComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public publicEventDisplay: PublicEventsDisplay =
    PublicEventsDisplay.public_events_list;
  public displayOptions: typeof PublicEventsDisplay = PublicEventsDisplay;

  public publicEventCategories: LocationCategory[] = [];
  public publicEvents: PublicEventTokenDTO[] = [];

  public publicEventsForm: FormGroup = this.formBuilder.group({
    public_event: [''],
  });
  public searchResults: PublicEventTokenDTO[] = [];

  private userLocation: LocationDTO;

  private searchResults$: Observable<PublicEventTokenDTO[]> = this.store.select(
    publicEventSearchSelector
  );
  private publicEvents$: Observable<PublicEventTokenDTO[]> =
    this.store.select(publicEventsSelector);
  private userLocation$: Observable<LocationDTO> =
    this.store.select(userLocationSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    Object.entries(PublicEventCategoriesList).forEach(([name, value]) => {
      const category: LocationCategory = {
        name: name,
        value: value,
        selected: false,
      };

      this.publicEventCategories.push(category);
    });

    const authLocationSub = this.userLocation$.subscribe(userLocation => {
      const locationValid: boolean =
        userLocation.latitude !== null && userLocation.longitude !== null
          ? true
          : false;

      if (locationValid && this.publicEventCategories.length !== 0) {
        this.userLocation = userLocation;
        const locationCategories: LocationCategoriesDTO = {
          categories: [],
          location: this.userLocation,
        };

        this.store.dispatch(
          retrievePublicEvents({ locationCategories: locationCategories })
        );
      }
    });

    this.subscriptions.add(authLocationSub);

    const publicEventsSub = this.publicEvents$.subscribe(publicEvents => {
      if (publicEvents) {
        this.publicEvents = [...publicEvents];
      }
    });

    this.subscriptions.add(publicEventsSub);

    const eventSearchSub = this.publicEventsForm
      .get('public_event')
      .valueChanges.subscribe(input => {
        const len = input.length;
        this.publicEventDisplay =
          len >= 1
            ? this.displayOptions.public_events_search
            : this.displayOptions.public_events_list;

        if (
          this.publicEventDisplay === this.displayOptions.public_events_list
        ) {
          this.searchResults = [];
        }

        if (len >= 3) {
          const searchDTO: SearchDTO = { searchParam: input };
          this.store.dispatch(
            retrievePublicEventSearchResults({ searchDTO: searchDTO })
          );
        }
      });

    this.subscriptions.add(eventSearchSub);

    const searchResultsSub = this.searchResults$.subscribe(searchResults => {
      if (searchResults) {
        this.searchResults = [...searchResults];
      }
    });

    this.subscriptions.add(searchResultsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public publicEventProfile(publicEvent: PublicEventTokenDTO): void {
    this.router.navigate([
      PublicEventRoutes.PUBLIC_EVENT_PROFILE,
      publicEvent.eventId,
    ]);
  }

  public selectEventCategory(eventCategory: string): void {
    this.publicEventCategories.forEach(category => {
      if (category.name === eventCategory) {
        category.selected = !category.selected;
      }
    });

    const selected: string[] = this.publicEventCategories
      .filter(category => category.selected)
      .map(
        category =>
          PublicEventCategories[
            category.name as keyof typeof PublicEventCategories
          ]
      );

    const locationCategories: LocationCategoriesDTO = {
      categories: [...selected],
      location: this.userLocation,
    };

    this.store.dispatch(
      retrievePublicEvents({ locationCategories: locationCategories })
    );
  }
}
