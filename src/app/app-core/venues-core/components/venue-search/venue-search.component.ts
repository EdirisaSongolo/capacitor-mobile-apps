import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  LocationCategoriesDTO,
  LocationDTO,
  SearchDTO,
} from '@app-core/app-api';
import { VenueTokenDTO } from '@app-core/venues-core/api';
import { VenueSearchDisplay } from '@app-core/venues-core/data-models';
import {
  locationVenuesSelector,
  retrieveLocationVenues,
  retrieveVenueSearchResults,
  venueSearchSelector,
} from '@app-core/venues-core/store';

import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-venue-search',
  templateUrl: './venue-search.component.html',
  styleUrls: ['./venue-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public location: LocationDTO;
  @Output() public placAction: EventEmitter<VenueTokenDTO> = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public venuesDisplay: VenueSearchDisplay = VenueSearchDisplay.venues_list;
  public displayOptions: typeof VenueSearchDisplay = VenueSearchDisplay;
  public componentAction: ComponentAction = ComponentAction.dashboard;

  public venueSearchForm: FormGroup = this.formBuilder.group({
    venue_search: [''],
  });
  public venuesList: VenueTokenDTO[] = [];
  public searchResults: VenueTokenDTO[] = [];

  private locationVenues$: Observable<VenueTokenDTO[]> = this.store.select(
    locationVenuesSelector
  );
  private searchResults$: Observable<VenueTokenDTO[]> =
    this.store.select(venueSearchSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const locationVenuesSub = this.locationVenues$.subscribe(locationVenues => {
      this.venuesList = [...locationVenues];
    });

    this.subscriptions.add(locationVenuesSub);

    const venueSearchSub = this.venueSearchForm
      .get('venue_search')
      .valueChanges.subscribe(input => {
        const len = input.length;
        this.venuesDisplay =
          len >= 1
            ? this.displayOptions.venue_search
            : this.displayOptions.venues_list;

        if (this.venuesDisplay === this.displayOptions.venues_list) {
          this.searchResults = [];
        }

        // This venue search should always append the location search, especially when creating venues for events
        // This comment above is just a thougght, not a TODO
        if (len >= 3) {
          const searchDTO: SearchDTO = { searchParam: input };
          this.store.dispatch(
            retrieveVenueSearchResults({ searchParam: searchDTO })
          );
        }
      });

    this.subscriptions.add(venueSearchSub);

    const searchResultsSub = this.searchResults$.subscribe(searchResults => {
      if (searchResults.length >= 1) {
        this.searchResults = [...searchResults];
      }
    });

    this.subscriptions.add(searchResultsSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['location']) {
      const location = changes['location'].currentValue;

      if (location) {
        this.location = location;
        const venueLocation: LocationCategoriesDTO = {
          categories: [],
          location: this.location,
        };

        this.store.dispatch(
          retrieveLocationVenues({ locationCategories: venueLocation })
        );
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public propateVenuePlacAction(userTokenDTO: VenueTokenDTO): void {
    this.placAction.emit(userTokenDTO);
  }
}
