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
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  providerSearchResultsSelector,
  retrieveFeatureServiceProviders,
  retrieveProviderSearchResults,
  retrieveStaffServiceProviders,
  serviceProvidersSelector,
} from '@profile-accounts-core/store';
import {
  ServiceProviderCategories,
  ServiceProviderDomains,
  ServiceProvidersDisplay,
} from '@profile-accounts-core/data-models';
import {
  LocationCategoriesDTO,
  LocationDTO,
  SearchDTO,
} from '@app-core/app-api';
import { LocationCategory } from '@domain-data-models/app-domain.interfaces';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

@Component({
  selector: 'Tsk-domain-service-providers',
  templateUrl: './domain-service-providers.component.html',
  styleUrls: ['./domain-service-providers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DomainServiceProvidersComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public serviceProviderDomain: ServiceProviderDomains;
  @Input() public location: LocationDTO;
  @Output() public providerAction: EventEmitter<ServiceProviderDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public profileOptions: typeof Profiles = Profiles;
  public componentAction: ComponentAction = ComponentAction.dashboard;
  public providersDisplay: ServiceProvidersDisplay =
    ServiceProvidersDisplay.service_providers;
  public providersDisplayOptions: typeof ServiceProvidersDisplay =
    ServiceProvidersDisplay;

  public providerSearchForm: FormGroup = this.formBuilder.group({
    provider_search: ['', Validators.required],
  });

  public serviceProviderCategories: LocationCategory[] = [];
  public serviceProviders: ServiceProviderDTO[] = [];
  public searchResults: ServiceProviderDTO[] = [];

  private serviceProviders$: Observable<ServiceProviderDTO[]> =
    this.store.select(serviceProvidersSelector);
  private providerSearchResults$: Observable<ServiceProviderDTO[]> =
    this.store.select(providerSearchResultsSelector);
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

    const serviceProvidersSub = this.serviceProviders$.subscribe(
      serviceProviders => {
        if (serviceProviders) {
          this.serviceProviders = [...serviceProviders];
        }
      }
    );

    this.subscriptions.add(serviceProvidersSub);

    const providerSearchSub = this.providerSearchForm
      .get('provider_search')
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

    this.subscriptions.add(providerSearchSub);

    const providerSearchResultsSub = this.providerSearchResults$.subscribe(
      searchResults => {
        if (searchResults) {
          this.searchResults = [...searchResults];
        }
      }
    );

    this.subscriptions.add(providerSearchResultsSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const eventLocation = changes['location']?.currentValue;

    if (eventLocation && this.serviceProviderDomain) {
      const locationCategories: LocationCategoriesDTO = {
        categories: [],
        location: this.location,
      };

      if (
        this.serviceProviderDomain === ServiceProviderDomains.feature_profiles
      ) {
        this.store.dispatch(
          retrieveFeatureServiceProviders({
            locationCategories: locationCategories,
          })
        );
      } else if (
        this.serviceProviderDomain === ServiceProviderDomains.staff_profiles
      ) {
        this.store.dispatch(
          retrieveStaffServiceProviders({
            locationCategories: locationCategories,
          })
        );
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(serviceProvider: ServiceProviderDTO): UserTokenDTO {
    return serviceProvider as UserTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO): VendorTokenDTO {
    return serviceProvider as VendorTokenDTO;
  }

  public initiateProviderAction(serviceProvider: ServiceProviderDTO): void {
    this.providerAction.emit(serviceProvider);
  }

  private selectProviderCategory(providerCategory: string): void {
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
      location: this.location,
    };

    // retrieve features or staff
  }
}
