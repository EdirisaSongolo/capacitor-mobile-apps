import { Injectable } from '@angular/core';
import { Device } from '@app-core/app-domain/domain-data-models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakPointService {
  public deviceSubject: BehaviorSubject<Device> = new BehaviorSubject<Device>(
    Device.desktop
  );
  public deviceObservable: Observable<Device> =
    this.deviceSubject.asObservable();

  public updateDeviceSubject(device: Device): void {
    this.deviceSubject.next(device);
  }
}
