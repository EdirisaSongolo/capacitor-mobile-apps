import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  AppResponseType,
  Device,
  LocationStatus,
  NavOption,
} from '@domain-data-models/app-domain.enums';

import {
  AppResponse,
  BreakPointService,
  LocationCoordinates,
  NavigationControl,
} from '@app-core/app-domain';

import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';

import {
  appResponseSelector,
  createAppResponse,
  userLocationSelector,
} from '@core-modules';

import { ApiCallIndicatorService, LocationDTO } from '@app-core/app-api';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { MatOptionSelectionChange } from '@angular/material/core';

export const TIME_OUT_IN_MILLISECONDS = 10000;

@Component({
  selector: 'Tsk-app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppNavigationComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayAppResponse: boolean = true;
  public apiCallInProgress: boolean = false;
  public appResponse: AppResponse | null = null;
  public responseTypes: typeof AppResponseType = AppResponseType;

  public currentLocation: string = null;
  public leftControls: NavigationControl[] = [
    {
      navOption: NavOption.dashboard,
      icon: 'picture_in_picture_large',
      route: '/dash-board',
    },
    {
      navOption: NavOption.create_event,
      icon: 'stream',
      route: '/create-event',
    },
    {
      navOption: NavOption.venues,
      icon: 'crop_portrait',
      route: '/venues',
    },
    {
      navOption: NavOption.service_providers,
      icon: 'hdr_weak',
      route: '/service-providers',
    },
    {
      navOption: NavOption.search,
      icon: 'search',
      route: '/search',
    },
  ];

  public rightControls: NavigationControl[] = [
    {
      navOption: NavOption.user_account,
      icon: 'people_alt',
      route: '/home',
    },
    {
      navOption: NavOption.messaging,
      icon: 'chat_bubble_outline',
      route: '/messaging',
    },
    {
      navOption: NavOption.notifications,
      icon: 'notifications_none',
      route: '/notifications',
    },
  ];

  public locationLabel: string = 'enter-location';
  public locationIcon: string = 'location_on';
  public possibleLocations: Observable<string[]>;
  public locationForm: FormGroup = this.formBuilder.group({
    userLocation: ['', Validators.required],
  });

  private locationInput: string;
  private locationStatus: LocationStatus;

  private apiCallInProgress$: Observable<boolean> =
    this.apiCallIndicator.apiCallInProgress$;
  private appResponse$: Observable<AppResponse> =
    this.store.select(appResponseSelector);
  private userLocation$: Observable<LocationDTO> =
    this.store.select(userLocationSelector);
  private locationCoordinates$: Observable<LocationCoordinates> =
    this.geoLocationService.locationCoordinates$.asObservable();
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private geoLocationService: GeoLocationService,
    private appResponseService: AppResponseService,
    private apiCallIndicator: ApiCallIndicatorService
  ) {}

  public ngOnInit(): void {
    const breakPointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakPointSub);

    const locationCoordsSub = this.locationCoordinates$.subscribe(
      locationCoordinates => {
        if (locationCoordinates) {
          this.geoLocationService.processUserLocationCoordinates(
            locationCoordinates
          );
        }
      }
    );

    this.subscriptions.add(locationCoordsSub);

    const userLocationSub = this.userLocation$.subscribe(userLocation => {
      if (userLocation?.latitude && userLocation?.longitude) {
        this.processUserLocation(userLocation);
        return;
      }

      if (this.currentLocation) {
        this.currentLocation = null;
        this.locationForm.patchValue({
          userLocation: null,
        });
      }
    });

    this.subscriptions.add(userLocationSub);

    const apiCallInProgressSub = this.apiCallInProgress$.subscribe(
      apiCallInProgress => (this.apiCallInProgress = apiCallInProgress)
    );

    this.subscriptions.add(apiCallInProgressSub);

    const appResponseSub = this.appResponse$.subscribe(appResponse => {
      if (!appResponse.viewed) {
        this.displayAppResponse = true;
        const appResponse: AppResponse = {
          viewed: true,
          type: null,
          messages: [],
        };

        setTimeout(() => {
          this.store.dispatch(createAppResponse({ appResponse: appResponse }));
          this.displayAppResponse = false;
        }, TIME_OUT_IN_MILLISECONDS);
      }
      this.appResponse = appResponse;
    });

    this.subscriptions.add(appResponseSub);

    const userLocationInputSub = this.locationForm
      .get('userLocation')
      ?.valueChanges.subscribe(userInput => {
        if (userInput) {
          this.locationInput = userInput as string;
          this.possibleLocations =
            this.geoLocationService.locationAutoCompleteSuggestions(
              this.locationInput
            );
        }
      });

    this.subscriptions.add(userLocationInputSub);

    const locationStatusSub = this.geoLocationService.locationStatus$.subscribe(
      locationStatus => {
        this.locationStatus = locationStatus;
        this.processLocationStatus(locationStatus);
      }
    );

    this.subscriptions.add(locationStatusSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public useCurrentLocation(selection: MatOptionSelectionChange<string>): void {
    if (!selection.isUserInput) return;

    this.geoLocationService.resolveDeviceLocation();
  }

  public updateUserLocation(location?: MatOptionSelectionChange<string>): void {
    if (location) {
      const locationInput = location.source.value;
      this.locationForm.patchValue({
        userLocation: locationInput,
      });
    }

    if (this.locationForm.invalid) {
      const messages: string[] = ['location-required'];
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    const activeElement = document.activeElement as HTMLElement;
    activeElement?.blur();

    const locationForm = this.locationForm.value;
    const userLocation = locationForm?.userLocation;
    this.geoLocationService.updateUserPosition(userLocation);
  }

  private async processUserLocation(locationDTO: LocationDTO): Promise<void> {
    if (this.locationStatus === LocationStatus.locationSet) {
      const currentLocation =
        await this.geoLocationService.retrieveLocationCityDistrict(locationDTO);
      this.currentLocation = currentLocation;
      this.locationForm.patchValue({
        userLocation: this.currentLocation,
      });

      return;
    }

    this.locationForm.patchValue({
      userLocation: null,
    });
  }

  private processLocationStatus(locationStatus: LocationStatus): void {
    const userLocationControl = this.locationForm.get('userLocation');

    if (locationStatus === LocationStatus.permissionDenied) {
      userLocationControl.disable();
      this.locationLabel = 'enable-location';
      return;
    }

    userLocationControl.enable();
    this.locationLabel =
      locationStatus === LocationStatus.locationUnavailable
        ? 'location-not-available'
        : 'enter-location';

    const locationUnavailable: boolean =
      locationStatus === LocationStatus.locationUnavailable;
    if (locationUnavailable && this.currentLocation) {
      userLocationControl.patchValue(this.currentLocation);
      const messages: string[] = ['location-not-available'];
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
    }
  }
}
