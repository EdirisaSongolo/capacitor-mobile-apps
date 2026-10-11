import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const TIME_OUT_IN_MILLISECONDS = 500;

@Injectable({
  providedIn: 'root',
})
export class ApiCallIndicatorService {
  private apiCallInProgress: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public apiCallInProgress$: Observable<boolean> =
    this.apiCallInProgress.asObservable();

  private callCompleted: boolean = true;

  constructor() {}

  public updateApiCallIndicator(state: boolean): void {
    if (state === true) {
      this.callCompleted = false;
      setTimeout(() => {
        if (!this.callCompleted) {
          this.apiCallInProgress.next(state);
        }
      }, TIME_OUT_IN_MILLISECONDS);
    } else if (state === false) {
      this.callCompleted = true;
      this.apiCallInProgress.next(state);
    }
  }
}
