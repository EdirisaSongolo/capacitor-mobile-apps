import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  public isOpen = false;
  public sideNav: BehaviorSubject<boolean> = new BehaviorSubject(this.isOpen);
  public isOpenSubscription = this.sideNav.asObservable();

  public openSideNav(): void {
    this.sideNav.next(true);
  }

  public updateIsOpen(): void {
    this.sideNav.next(false);
  }
}
