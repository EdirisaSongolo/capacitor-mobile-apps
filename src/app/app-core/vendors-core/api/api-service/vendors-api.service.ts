import { Injectable } from '@angular/core';
import { ApiService } from '@app-core/app-api';
import { Observable } from 'rxjs';
import {
  VendorTokenDTO,
  VendorManagerDTO,
} from '@vendors-core/api/vendors.dto-models';
import { VendorsRestConstants } from '@vendors-core/api/vendors.rest-constants';
import { ProfileDTO } from '@app-core/app-api/app-api.dto-models';

@Injectable({
  providedIn: 'root',
})
export class VendorsApiService {
  constructor(private apiService: ApiService) {}

  public createVendorProfile(
    vendorDTO: VendorTokenDTO
  ): Observable<VendorTokenDTO> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.CREATE_VENDOR_PROFILE}`;
    return this.apiService.post<VendorTokenDTO>(requestMapping, vendorDTO);
  }

  public updateVendorProfileDetails(
    venueDTO: VendorTokenDTO
  ): Observable<VendorTokenDTO> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.UPDATE_VENDOR_PROFILE_DETAILS}`;
    return this.apiService.put<VendorTokenDTO>(requestMapping, venueDTO);
  }

  public retrieveVendor(profile: ProfileDTO): Observable<VendorTokenDTO> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.RETRIEVE_VENDOR_TOKEN}`;
    return this.apiService.post<VendorTokenDTO>(requestMapping, profile);
  }

  public retrieveUserManagedVendors(): Observable<VendorTokenDTO[]> {
    const requestMapping = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.RETRIEVE_USER_MANAGED_VENDORS}`;
    return this.apiService.get<VendorTokenDTO[]>(requestMapping);
  }

  public createVendorManager(
    vendorManager: VendorManagerDTO
  ): Observable<VendorManagerDTO[]> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.CREATE_VENDOR_MANAGER}`;
    return this.apiService.post<VendorManagerDTO[]>(
      requestMapping,
      vendorManager
    );
  }

  public retrieveVendorManagers(
    profile: ProfileDTO
  ): Observable<VendorManagerDTO[]> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.RETRIEVE_VENDOR_MANAGERS}`;
    return this.apiService.post<VendorManagerDTO[]>(requestMapping, profile);
  }

  public removeVendorManagement(
    vendorManagement: VendorManagerDTO[]
  ): Observable<VendorManagerDTO[]> {
    const requestMapping: string = `${VendorsRestConstants.VENDOR_PROFILES}/${VendorsRestConstants.REMOVE_VENDOR_MANAGERS}`;
    return this.apiService.put(requestMapping, vendorManagement);
  }
}
