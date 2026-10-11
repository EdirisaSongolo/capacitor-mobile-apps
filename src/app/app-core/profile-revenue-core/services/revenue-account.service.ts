import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RevenueAccountService {
  public accountMain: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public accountMain$: Observable<boolean> = this.accountMain.asObservable();

  constructor() {}

  public setAccountMain(value: boolean): void {
    this.accountMain.next(value);
  }
}
