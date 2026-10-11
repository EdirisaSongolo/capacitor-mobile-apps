import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@app-core/app-api';
import { VenuesRestConstants } from '@venues-core/api/venues.rest-constants';
import { ProfileAccountsRestConstants } from '@profile-accounts-core/api/profile-accounts.rest-constants';
import {
  VenueTokenDTO,
  VenueManagerDTO,
} from '@venues-core/api/venues.dto-models';
import {
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
} from '@app-core/app-api/app-api.dto-models';

@Injectable({
  providedIn: 'root',
})
export class VenuesApiService {
  constructor(private apiService: ApiService) {}

  public createVenueProfileAccount(
    venueDTO: VenueTokenDTO
  ): Observable<VenueTokenDTO> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.CREATE_VENUE_PROFILE}`;
    return this.apiService.post<VenueTokenDTO>(requestMapping, venueDTO);
  }

  public updateVenueProfileDetails(
    venueDTO: VenueTokenDTO
  ): Observable<VenueTokenDTO> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.UPDATE_VENUE_PROFILE_DETAILS}`;
    return this.apiService.put<VenueTokenDTO>(requestMapping, venueDTO);
  }

  public retrieveVenue(profile: ProfileDTO): Observable<VenueTokenDTO> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.RETRIEVE_VENUE_TOKEN}`;
    return this.apiService.post(requestMapping, profile);
  }

  public retrieveLocationVenues(
    location: LocationCategoriesDTO
  ): Observable<VenueTokenDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_LOCATION_VENUES}`;
    return this.apiService.post<VenueTokenDTO[]>(requestMapping, location);
  }

  public retrieveUserManagedVenues(): Observable<VenueTokenDTO[]> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.RETRIEVE_USER_MANAGED_VENUES}`;
    return this.apiService.get<VenueTokenDTO[]>(requestMapping);
  }

  public createVenueManager(
    venueManager: VenueManagerDTO
  ): Observable<VenueManagerDTO[]> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.CREATE_VENUE_MANAGER}`;
    return this.apiService.post<VenueManagerDTO[]>(
      requestMapping,
      venueManager
    );
  }

  public retrieveVenueManagers(
    profile: ProfileDTO
  ): Observable<VenueManagerDTO[]> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.RETRIEVE_VENUE_MANAGERS}`;
    return this.apiService.post<VenueManagerDTO[]>(requestMapping, profile);
  }

  public removeVenueManagement(
    venueManagement: VenueManagerDTO[]
  ): Observable<VenueManagerDTO[]> {
    const requestMapping: string = `${VenuesRestConstants.VENUE_PROFILES}/${VenuesRestConstants.REMOVE_VENUE_MANAGERS}`;
    return this.apiService.put<VenueManagerDTO[]>(
      requestMapping,
      venueManagement
    );
  }

  public retrieveVenueSearchResults(
    searchDTO: SearchDTO
  ): Observable<VenueTokenDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_VENUE_SEARCH_RESULTS}`;
    return this.apiService.post<VenueTokenDTO[]>(requestMapping, searchDTO);
  }
}
