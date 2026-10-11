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
import { userLocationSelector } from '@core-modules';

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
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocationCategory } from '@domain-data-models/app-domain.interfaces';
import {
  ProfileAccountsConstants,
  VenueCategories,
} from '@profile-accounts-core/data-models';

@Component({
  selector: 'Tsk-venues-home',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenuesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public venuesDisplay: VenueSearchDisplay = VenueSearchDisplay.venues_list;
  public displayOptions: typeof VenueSearchDisplay = VenueSearchDisplay;

  public venueCategories: LocationCategory[] = [];
  public venuesList: VenueTokenDTO[] = [];

  public venueSearchForm: FormGroup = this.formBuilder.group({
    venue_search: [''],
  });
  public searchResults: VenueTokenDTO[] = [];

  private userLocation: LocationDTO;

  private locationVenues$: Observable<VenueTokenDTO[]> = this.store.select(
    locationVenuesSelector
  );
  private searchResults$: Observable<VenueTokenDTO[]> =
    this.store.select(venueSearchSelector);
  private userLocation$: Observable<LocationDTO> =
    this.store.select(userLocationSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    Object.entries(ProfileAccountsConstants.VenueCategoriesList).forEach(
      ([name, value]) => {
        const category: LocationCategory = {
          name: name,
          value: value,
          selected: false,
        };

        this.venueCategories.push(category);
      }
    );

    const userLocationSub = this.userLocation$.subscribe(userLocation => {
      const locationValid: boolean =
        userLocation.latitude !== null && userLocation.longitude !== null
          ? true
          : false;

      if (locationValid) {
        this.userLocation = userLocation;
        const locationCategories: LocationCategoriesDTO = {
          categories: [],
          location: this.userLocation,
        };

        this.store.dispatch(
          retrieveLocationVenues({ locationCategories: locationCategories })
        );
      }
    });

    this.subscriptions.add(userLocationSub);

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

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public selectVenueCategory(venueCategory: string): void {
    this.venueCategories.forEach(category => {
      if (category.name === venueCategory) {
        category.selected = !category.selected;
      }
    });

    const selected: string[] = this.venueCategories
      .filter(category => category.selected)
      .map(
        category =>
          VenueCategories[category.name as keyof typeof VenueCategories]
      );

    const locationCategories: LocationCategoriesDTO = {
      categories: [...selected],
      location: this.userLocation,
    };

    this.store.dispatch(
      retrieveLocationVenues({ locationCategories: locationCategories })
    );
  }
}
