import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  LocationCoordinates,
  LocationDetails,
} from '@domain-data-models/app-domain.interfaces';
import { LocationDTO } from '@app-core/app-api/app-api.dto-models';
import { AppDomainConstants } from '@domain-data-models/app-domain.constants';
import { ApiCallIndicatorService } from '@app-core/app-api';
import { LocationStatus } from '@domain-data-models/app-domain.enums';
import { LocationMappersService } from '@domain-services/mappers';
import {
  updateUserLocation,
  userLocation as initialUserLocation,
} from '@core-modules';

type LocationField =
  | 'street_number'
  | 'route'
  | 'postal_code'
  | 'locality'
  | 'administrative_area_level_1'
  | 'country';

const locationFieldNames = new Set<LocationField>([
  'street_number',
  'route',
  'postal_code',
  'locality',
  'administrative_area_level_1',
  'country',
]);

const dualFieldNames = new Set<LocationField>([
  'administrative_area_level_1',
  'country',
]);

interface RequiredFields {
  street_number?: string;
  route?: string;
  postal_code?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_1_short?: string;
  country?: string;
  country_short?: string;
  latitude?: number;
  longitude?: number;
}

enum PermissionStatus {
  prompt = 'prompt',
  granted = 'granted',
  denied = 'denied',
}

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private googleMapsApi = new Loader({
    apiKey: environment.googleMapsKey,
    libraries: ['core', 'places', 'geometry'],
  });

  public locationComponents: LocationDetails;

  public locationStatus$: BehaviorSubject<LocationStatus> =
    new BehaviorSubject<LocationStatus>(LocationStatus.locationSet);
  public locationCoordinates$: BehaviorSubject<LocationCoordinates> =
    new BehaviorSubject(null);

  constructor(
    private apiCallIndicatorService: ApiCallIndicatorService,
    private locationMappers: LocationMappersService,
    private store: Store
  ) {
    this.resolveUserLocation();
    navigator.permissions.query({ name: 'geolocation' }).then(status => {
      if (status.state === PermissionStatus.denied) {
        this.deleteStoredLocation();
      }

      status.onchange = () => {
        if (status.state === PermissionStatus.granted) {
          this.resolveUserLocation();
        } else if (status.state === PermissionStatus.denied) {
          this.deleteStoredLocation();
        }
      };
    });
  }

  public resolveDeviceLocation(): void {
    if (!navigator.geolocation) {
      this.locationStatus$.next(LocationStatus.locationUnavailable);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.locationStatus$.next(LocationStatus.locationSet);
        this.locationCoordinates$.next(userLocation);
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          this.locationStatus$.next(LocationStatus.permissionDenied);
        } else {
          this.locationStatus$.next(LocationStatus.locationUnavailable);
        }
      }
    );
  }

  public locationAutoCompleteSuggestions(
    userInput: string
  ): Observable<string[]> {
    return from(
      this.googleMapsApi.importLibrary('places').then(async () => {
        const request: google.maps.places.AutocompletionRequest = {
          input: userInput,
        };

        const { suggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
          );

        return suggestions
          .filter(suggestion => suggestion.placePrediction !== null)
          .map(suggestion => suggestion.placePrediction.text.toString());
      })
    );
  }

  public async retrieveGeoLocationData(
    designatedLocation: string | any
  ): Promise<LocationDetails> {
    if (!designatedLocation || designatedLocation.length === 0) {
      return Promise.resolve(null);
    }

    return this.googleMapsApi.importLibrary('places').then(async () => {
      const geoCodeRequest: google.maps.GeocoderRequest = {
        address: designatedLocation,
      };

      const geoCoderService: google.maps.Geocoder = new google.maps.Geocoder();
      const geoCodeResults = await geoCoderService
        .geocode(geoCodeRequest)
        .catch((): any => null);
      this.locationComponents = this.processGeoCodeResults(geoCodeResults);
      return this.locationComponents;
    });
  }

  public locationFormattedAddress(location: LocationDTO): Observable<string> {
    if (!location?.latitude || !location?.longitude) {
      return of('');
    }

    return from(
      this.googleMapsApi.importLibrary('places').then(async () => {
        const geoCodeRequest: google.maps.GeocoderRequest = {
          location: { lat: location.latitude, lng: location.longitude },
        };

        const geoCoderService: google.maps.Geocoder =
          new google.maps.Geocoder();
        const geoCodeResults = await geoCoderService.geocode(geoCodeRequest);
        const locationGeoData = geoCodeResults.results[0];
        return locationGeoData?.formatted_address ?? '';
      })
    );
  }

  public locationCityDistrict(location: LocationDTO): Observable<string> {
    if (!location?.latitude || !location?.longitude) {
      return of('');
    }

    return from(
      this.googleMapsApi.importLibrary('places').then(async () => {
        const geoCodeRequest: google.maps.GeocoderRequest = {
          location: { lat: location.latitude, lng: location.longitude },
        };

        const geoCoderService: google.maps.Geocoder =
          new google.maps.Geocoder();
        const geoCodeResults = await geoCoderService.geocode(geoCodeRequest);
        const locationGeoData = geoCodeResults.results[0];

        return locationGeoData ? this.cityDistrictString(locationGeoData) : '';
      })
    );
  }

  public async retrieveLocationCityDistrict(
    location: LocationDTO
  ): Promise<string> {
    if (!location?.latitude || !location?.longitude) {
      return Promise.resolve('');
    }

    return this.googleMapsApi.importLibrary('places').then(async () => {
      const geoCodeRequest: google.maps.GeocoderRequest = {
        location: { lat: location.latitude, lng: location.longitude },
      };

      const geoCoderService: google.maps.Geocoder = new google.maps.Geocoder();
      const geoCodeResults = await geoCoderService.geocode(geoCodeRequest);
      const locationGeoData = geoCodeResults.results[0];

      return locationGeoData ? this.cityDistrictString(locationGeoData) : '';
    });
  }

  public async updateUserPosition(locationInput: string): Promise<void> {
    this.apiCallIndicatorService.updateApiCallIndicator(true);
    await this.googleMapsApi.importLibrary('places');

    const geoCodeRequest: google.maps.GeocoderRequest = {
      address: locationInput,
    };

    const geoCoderService: google.maps.Geocoder = new google.maps.Geocoder();
    const geoCodeResults = await geoCoderService.geocode(geoCodeRequest);
    const locationGeoData = geoCodeResults.results[0];

    const locationCoordinates: LocationCoordinates = {
      latitude: locationGeoData.geometry.location.lat(),
      longitude: locationGeoData.geometry.location.lng(),
    };

    this.locationStatus$.next(LocationStatus.locationSet);
    this.locationCoordinates$.next(locationCoordinates);
    this.apiCallIndicatorService.updateApiCallIndicator(false);
  }

  public async processUserLocationCoordinates(
    locationCoordinates: LocationCoordinates
  ): Promise<void> {
    this.apiCallIndicatorService.updateApiCallIndicator(true);

    await this.googleMapsApi.importLibrary('geocoding');
    const geoCodeRequest: google.maps.GeocoderRequest = {
      location: {
        lat: locationCoordinates.latitude,
        lng: locationCoordinates.longitude,
      },
    };

    const geocoder = new google.maps.Geocoder();
    const geoCoderResponse = await geocoder.geocode(geoCodeRequest);
    const locationComponents = this.processGeoCodeResults(geoCoderResponse);
    const locationDTO =
      this.locationMappers.createLocationDTO(locationComponents);

    this.updateStoredLocation(locationDTO);
    this.store.dispatch(updateUserLocation({ userLocation: locationDTO }));
    this.apiCallIndicatorService.updateApiCallIndicator(false);
  }

  private updateStoredLocation(updatedLocation: LocationDTO): void {
    const locationString: string = JSON.stringify(updatedLocation);
    localStorage.setItem(AppDomainConstants.CURRENT_LOCATION, locationString);
  }

  private deleteStoredLocation(): void {
    localStorage.removeItem(AppDomainConstants.CURRENT_LOCATION);
    this.locationStatus$.next(LocationStatus.permissionDenied);
    this.store.dispatch(
      updateUserLocation({ userLocation: { ...initialUserLocation } })
    );
  }

  private resolveUserLocation(): void {
    if (!navigator.geolocation) {
      this.locationStatus$.next(LocationStatus.locationUnavailable);
      return;
    }

    const storedLocation: string = localStorage.getItem(
      AppDomainConstants.CURRENT_LOCATION
    );

    if (storedLocation) {
      const currentLocation: LocationDTO = JSON.parse(storedLocation);
      const userLocation: LocationCoordinates = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };

      this.locationStatus$.next(LocationStatus.locationSet);
      this.locationCoordinates$.next(userLocation);
      return;
    }

    this.resolveDeviceLocation();
  }

  private processGeoCodeResults(geoCodeResults: any): LocationDetails {
    if (!geoCodeResults) return null;

    const locationGeoData = geoCodeResults.results[0];
    const requiredFields: RequiredFields = {
      latitude: locationGeoData.geometry.location.lat(),
      longitude: locationGeoData.geometry.location.lng(),
    };

    const addressComponents: any[] = locationGeoData.address_components;

    for (const component of addressComponents) {
      const locationField = component.types[0] as LocationField;
      if (!locationFieldNames.has(locationField)) continue;

      requiredFields[locationField] = component.long_name;
      if (dualFieldNames.has(locationField)) {
        const shortName = `${locationField}_short` as any;
        (requiredFields as any)[shortName] = component.short_name;
      }
    }

    const locationDetails: LocationDetails = {
      street_number: requiredFields.street_number,
      street: requiredFields.route,
      postal_code: requiredFields.postal_code,
      city: requiredFields.locality,
      state: requiredFields.administrative_area_level_1_short,
      country: requiredFields.country_short,
      latitude: requiredFields.latitude,
      longitude: requiredFields.longitude,
    };

    return locationDetails;
  }

  private cityDistrictString(
    locationGeoData: google.maps.GeocoderResult
  ): string {
    if (!locationGeoData) return '';

    const addressComponents: any[] = locationGeoData.address_components;
    let city: string = '';
    let state: string = '';

    for (const component of addressComponents) {
      const locationField = component.types[0] as LocationField;
      switch (locationField) {
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          state = component.short_name;
          break;
      }
    }

    return city ? `${city}, ${state}` : state;
  }
}
