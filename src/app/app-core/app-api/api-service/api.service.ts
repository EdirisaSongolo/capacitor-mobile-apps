import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRestConstants } from '@app-core/app-api/app-api.rest-constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private tuuskaApi: string = `${ApiRestConstants.TUUSKA}/${ApiRestConstants.API}`;

  constructor(private httpClient: HttpClient) {}

  public post<T>(
    requestMapping: string,
    requestBody: any,
    headers?: HttpHeaders,
    parameters?: HttpParams
  ): Observable<T> {
    const endPoint: string = `${this.tuuskaApi}/${requestMapping}`;

    let httpHeaders = headers ? headers : new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.CONTENT_TYPE,
      ApiRestConstants.APPLICATION_JSON
    );

    return this.httpClient.post<T>(endPoint, requestBody, {
      headers: httpHeaders,
      params: parameters,
    });
  }

  public multiPartPost<T>(
    requestMapping: string,
    requestBody: any,
    headers?: HttpHeaders,
    parameters?: HttpParams
  ): Observable<T> {
    const endPoint: string = `${this.tuuskaApi}/${requestMapping}`;

    const httpHeaders = headers ? headers : new HttpHeaders();

    return this.httpClient.post<T>(endPoint, requestBody, {
      headers: httpHeaders,
      params: parameters,
    });
  }

  public put<T>(
    requestMapping: string,
    requestBody: any,
    headers?: HttpHeaders,
    parameters?: HttpParams
  ): Observable<T> {
    const endPoint: string = `${this.tuuskaApi}/${requestMapping}`;

    let httpHeaders = headers ? headers : new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.CONTENT_TYPE,
      ApiRestConstants.APPLICATION_JSON
    );

    return this.httpClient.put<T>(endPoint, requestBody, {
      headers: httpHeaders,
      params: parameters,
    });
  }

  public get<T>(
    requestMapping: string,
    headers?: HttpHeaders,
    parameters?: HttpParams
  ): Observable<T> {
    const endPoint: string = `${this.tuuskaApi}/${requestMapping}`;

    let httpHeaders = headers ? headers : new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.CONTENT_TYPE,
      ApiRestConstants.APPLICATION_JSON
    );

    return this.httpClient.get<T>(endPoint, {
      headers: httpHeaders,
      params: parameters,
    });
  }

  public delete<T>(
    requestMapping: string,
    headers?: HttpHeaders,
    parameters?: HttpParams
  ): Observable<T> {
    const endPoint: string = `${this.tuuskaApi}/${requestMapping}`;

    let httpHeaders = headers ? headers : new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.CONTENT_TYPE,
      ApiRestConstants.APPLICATION_JSON
    );

    return this.httpClient.delete<T>(endPoint, { params: parameters });
  }
}
