import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  LocationCategoriesDTO,
  LocationDTO,
  SearchDTO,
} from '@app-core/app-api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  providerSearchResultsSelector,
  retrieveProviderSearchResults,
  retrieveServiceProviders,
  serviceProvidersSelector,
} from '@profile-accounts-core/store';
import { userLocationSelector } from '@core-modules';
import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ProfileAccountsConstants } from '@profile-accounts-core/data-models';
import {
  ServiceProviderCategories,
  ServiceProvidersDisplay,
} from '@profile-accounts-core/data-models';
import { LocationCategory } from '@domain-data-models/app-domain.interfaces';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

@Component({
  selector: 'Tsk-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ServiceProvidersComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.profile;
  public providersDisplay: ServiceProvidersDisplay =
    ServiceProvidersDisplay.service_providers;
  public providersDisplayOptions: typeof ServiceProvidersDisplay =
    ServiceProvidersDisplay;
  public profileOptions: typeof Profiles = Profiles;

  public serviceProviderCategories: LocationCategory[] = [];
  public serviceProviders: ServiceProviderDTO[] = [];

  public serviceProvidersForm: FormGroup = this.formBuilder.group({
    service_providers: [''],
  });
  public searchResults: ServiceProviderDTO[] = [];

  private userLocation: LocationDTO;

  private providerSearchResults$: Observable<ServiceProviderDTO[]> =
    this.store.select(providerSearchResultsSelector);
  private serviceProviders$: Observable<ServiceProviderDTO[]> =
    this.store.select(serviceProvidersSelector);
  private userLocation$: Observable<LocationDTO> =
    this.store.select(userLocationSelector);
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

    Object.entries(
      ProfileAccountsConstants.ServiceProviderCategoriesList
    ).forEach(([name, value]) => {
      const category: LocationCategory = {
        name: name,
        value: value,
        selected: false,
      };

      this.serviceProviderCategories.push(category);
    });

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
          retrieveServiceProviders({ locationCategories: locationCategories })
        );
      }
    });

    this.subscriptions.add(userLocationSub);

    const serviceProvidersSub = this.serviceProviders$.subscribe(
      serviceProviders => {
        if (serviceProviders && serviceProviders.length >= 1) {
          this.serviceProviders = [...serviceProviders];
        }
      }
    );

    this.subscriptions.add(serviceProvidersSub);

    const eventSearchSub = this.serviceProvidersForm
      .get('service_providers')
      .valueChanges.subscribe(input => {
        const len = input.length;
        this.providersDisplay =
          len >= 1
            ? this.providersDisplayOptions.search_results
            : this.providersDisplayOptions.service_providers;

        if (
          this.providersDisplay === this.providersDisplayOptions.search_results
        ) {
          this.searchResults = [];
        }

        if (len >= 3) {
          const searchDTO: SearchDTO = { searchParam: input };
          this.store.dispatch(
            retrieveProviderSearchResults({ searchDTO: searchDTO })
          );
        }
      });

    this.subscriptions.add(eventSearchSub);

    const providerSearchResultsSub = this.providerSearchResults$.subscribe(
      searchResults => {
        if (searchResults) {
          this.searchResults = [...searchResults];
        }
      }
    );

    this.subscriptions.add(providerSearchResultsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as UserTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as VendorTokenDTO;
  }

  public selectProviderCategory(providerCategory: string): void {
    this.serviceProviderCategories.forEach(category => {
      if (category.name === providerCategory) {
        category.selected = !category.selected;
      }
    });

    const selected: string[] = this.serviceProviderCategories
      .filter(category => category.selected)
      .map(
        category =>
          ServiceProviderCategories[
            category.name as keyof typeof ServiceProviderCategories
          ]
      );

    const locationCategories: LocationCategoriesDTO = {
      categories: [...selected],
      location: this.userLocation,
    };

    this.store.dispatch(
      retrieveServiceProviders({ locationCategories: locationCategories })
    );
  }
}
