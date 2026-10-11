import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiService,
  ProfileTokenDTO,
  ResourceReferenceDTO,
  SearchDTO,
} from '@app-core/app-api';
import { SearchRecord } from '@composite-core/api/composite.dto-models';
import { CompositeRestConstants } from '@composite-core/api/composite.rest-constants';

@Injectable({
  providedIn: 'root',
})
export class CompositeApiService {
  constructor(private apiService: ApiService) {}

  public retrieveSearchHistory(): Observable<SearchRecord[]> {
    const requestMapping: string = `${CompositeRestConstants.COMPOSITE}/${CompositeRestConstants.RETRIEVE_SEARCH_HISTORY}`;
    return this.apiService.get<SearchRecord[]>(requestMapping);
  }

  public retrieveSearchResults(
    search: SearchDTO
  ): Observable<ProfileTokenDTO[]> {
    const requestMapping: string = `${CompositeRestConstants.COMPOSITE}/${CompositeRestConstants.RETRIEVE_SEARCH_RESULTS}`;
    return this.apiService.post<ProfileTokenDTO[]>(requestMapping, search);
  }

  public deleteSearchRecord(
    resourceReference: ResourceReferenceDTO
  ): Observable<void> {
    const requestMapping: string = `${CompositeRestConstants.COMPOSITE}/${CompositeRestConstants.DELETE_SEARCH_RECORD}`;
    return this.apiService.post<void>(requestMapping, resourceReference);
  }
}
