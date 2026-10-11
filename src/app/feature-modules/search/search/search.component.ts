import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  ReferencedResources,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';

import {
  ProfileTokenDTO,
  ResourceReferenceDTO,
  SearchDTO,
} from '@app-core/app-api';
import { SearchRecord } from '@app-core/composite-core/api';
import { SearchDisplay } from '@app-core/composite-core/data-models';
import {
  deleteSearchRecord,
  retrieveSearchHistory,
  retrieveSearchResults,
  searchHitorySelector,
  searchResultsSelector,
} from '@app-core/composite-core/store';
import { AuthService } from '@auth-core/auth-service';
import { PublicEventTokenDTO } from '@public-events-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { VenueTokenDTO } from '@venues-core/api';

@Component({
  selector: 'Tsk-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SearchComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileTypes: typeof Profiles = Profiles;
  public searchDisplay: SearchDisplay = SearchDisplay.search_history;
  public displayOptions: typeof SearchDisplay = SearchDisplay;
  public componentAction: ComponentAction = ComponentAction.profile;

  public searchRecords: SearchRecord[] = [];
  public searchResults: ProfileTokenDTO[] = [];
  public removeIcon: string = 'delete';
  public noSearchHistory: string = 'search.no-search-history';
  public noSearchResults: string = 'search.no-search-results';

  public searchParamForm = this.formBuilder.group({
    searchParam: ['', Validators.required],
  });

  private searchHistory$: Observable<SearchRecord[]> =
    this.store.select(searchHitorySelector);
  private searchResults$: Observable<ProfileTokenDTO[]> = this.store.select(
    searchResultsSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  private authenticated: boolean = false;

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private store: Store,
    private appResponseService: AppResponseService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const authSub = this.authService.userAuthenicated$.subscribe(
      authenticated => {
        this.authenticated = authenticated;

        if (authenticated) {
          this.store.dispatch(retrieveSearchHistory());
        }
      }
    );

    this.subscriptions.add(authSub);

    const searchHistorySub = this.searchHistory$.subscribe(searchRecords => {
      if (searchRecords) {
        this.searchRecords = [...searchRecords];
      }
    });

    this.subscriptions.add(searchHistorySub);

    const searchResultsSub = this.searchResults$.subscribe(searchResults => {
      if (searchResults) {
        this.searchResults = [...searchResults];
      }
    });

    this.subscriptions.add(searchResultsSub);

    const formValuesSub = this.searchParamForm
      .get('searchParam')
      .valueChanges.subscribe(formValues => {
        if (formValues.length === 0) {
          if (this.searchDisplay !== this.displayOptions.search_history) {
            this.searchDisplay = this.displayOptions.search_history;

            if (this.authenticated) {
              this.store.dispatch(retrieveSearchHistory());
            }
          }
        }
      });

    this.subscriptions.add(formValuesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(searchResult: ProfileTokenDTO) {
    return searchResult as UserTokenDTO;
  }

  public asVenueToken(searchResult: ProfileTokenDTO) {
    return searchResult as VenueTokenDTO;
  }

  public asVendorToken(searchResult: ProfileTokenDTO) {
    return searchResult as VendorTokenDTO;
  }

  public asPublicEventToken(searchResult: ProfileTokenDTO) {
    return searchResult as PublicEventTokenDTO;
  }

  public submitSearchParam(): void {
    if (this.searchParamForm.invalid) {
      const error: string = 'search.search-form.invalid-search';
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        error,
      ]);
      return;
    }

    const formValues = this.searchParamForm.value;
    this.retrieveSearchResults(formValues.searchParam);
  }

  public retrieveSearchResults(searchParam: string): void {
    const search: SearchDTO = {
      searchParam: searchParam,
    };

    this.store.dispatch(retrieveSearchResults({ search: search }));
    this.searchDisplay = this.displayOptions.search_results;
  }

  public deleteSearchRecord(searchRecord: SearchRecord): void {
    const resourceReference: ResourceReferenceDTO = {
      resource: ReferencedResources.searchRecord,
      referenceId: searchRecord.searchId,
    };

    this.store.dispatch(
      deleteSearchRecord({ resourceReference: resourceReference })
    );
  }
}
