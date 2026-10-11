import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiService,
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
  SuccessResponseDTO,
  UserEventDTO,
} from '@app-core/app-api';
import {
  ProviderServiceDTO,
  ServiceProviderDTO,
  BusinessProfileDTO,
} from '@profile-accounts-core/api/profile-accounts.dto-models';
import { ProfileAccountsRestConstants } from '@profile-accounts-core/api/profile-accounts.rest-constants';

@Injectable({
  providedIn: 'root',
})
export class ProfileAccountsApiService {
  constructor(private apiService: ApiService) {}

  public retrieveManagedProfiles(): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_MANANGED_PROFILES}`;
    return this.apiService.get<ServiceProviderDTO[]>(requestMapping);
  }

  public registerBusinessProfile(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.REGISTER_BUSINESS_PROFILE}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public disableBusinessProfile(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.DISABLE_BUSINESS_PROFILE}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public retrieveBusinessProfile(
    profileDTO: ProfileDTO
  ): Observable<BusinessProfileDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_BUSINESS_PROFILE}`;
    return this.apiService.post<BusinessProfileDTO>(requestMapping, profileDTO);
  }

  public updateBusinessProfileCategory(
    businessProfile: BusinessProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.UPDATE_BUSINESS_PROFILE_CATEGORY}`;
    return this.apiService.put<SuccessResponseDTO>(
      requestMapping,
      businessProfile
    );
  }

  public updateBusinessProfileBaseRate(
    businessProfile: BusinessProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.UPDATE_BUSINESS_PROFILE_BASE_RATE}`;
    return this.apiService.put<SuccessResponseDTO>(
      requestMapping,
      businessProfile
    );
  }

  public createProviderService(
    profileService: ProviderServiceDTO
  ): Observable<ProviderServiceDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.CREATE_PROVIDER_SERVICE}`;
    return this.apiService.post<ProviderServiceDTO[]>(
      requestMapping,
      profileService
    );
  }

  public updateProviderService(
    profileService: ProviderServiceDTO
  ): Observable<ProviderServiceDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.UPDATE_PROVIDER_SERVICE}`;
    return this.apiService.put<ProviderServiceDTO[]>(
      requestMapping,
      profileService
    );
  }

  public deleteProviderService(
    providerService: ProviderServiceDTO
  ): Observable<ProviderServiceDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.DELETE_PROVIDER_SERVICE}`;
    return this.apiService.post<ProviderServiceDTO[]>(
      requestMapping,
      providerService
    );
  }

  public retrieveServiceProviders(
    locationCategories: LocationCategoriesDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_SERVICE_PROVIDERS}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      locationCategories
    );
  }

  public retrieveFeatureServiceProviders(
    locationCategories: LocationCategoriesDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_FEATURE_SERVICE_PROVIDERS}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      locationCategories
    );
  }

  public retrieveStaffServiceProviders(
    locationCategories: LocationCategoriesDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_STAFF_SERVICE_PROVIDERS}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      locationCategories
    );
  }

  public retrieveProviderSearchResults(
    searchDTO: SearchDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_PROVIDER_SEARCH_RESULTS}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      searchDTO
    );
  }

  public retrieveServiceProvider(
    profileDTO: ProfileDTO
  ): Observable<ServiceProviderDTO> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_SERVICE_PROVIDER}`;
    return this.apiService.post<ServiceProviderDTO>(requestMapping, profileDTO);
  }

  public retrieveUserEvents(): Observable<UserEventDTO[]> {
    const requestMapping: string = `${ProfileAccountsRestConstants.PROFILE_ACCOUNTS}/${ProfileAccountsRestConstants.RETRIEVE_USER_EVENTS}`;
    return this.apiService.get<UserEventDTO[]>(requestMapping);
  }
}
