import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { VendorsConstants } from '@vendors-core/data-models';
import { VendorTokenDTO } from '@vendors-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { serviceProviderSelector } from '@profile-accounts-core/store';

@Component({
  selector: 'Tsk-vendor-profile-header',
  templateUrl: './vendor-profile-header.component.html',
  styleUrls: ['./vendor-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorProfileHeaderComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `url(${VendorsConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public apps: string = 'crop_free';

  public vendorName: string;
  public vendorAddress: string;
  public vendorLocation: string;
  public vendorDescription: string;

  private serviceProvider: ServiceProviderDTO;
  private vendorToken: VendorTokenDTO;

  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.vendorToken = this.serviceProvider as VendorTokenDTO;
          this.processVendorDTO(this.vendorToken);
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private processVendorDTO(vendorToken: VendorTokenDTO): void {
    if (vendorToken?.profileImage) {
      const imagePath = vendorToken?.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.vendorName = vendorToken.vendorName;

    const vendorLocation = vendorToken.vendorLocation;
    const venueCity = vendorLocation.city;
    const venueState = vendorLocation.state;
    this.vendorAddress = vendorLocation.address;
    this.vendorLocation = `${venueCity}, ${venueState}`;

    this.vendorDescription = vendorToken.vendorDescription;
  }
}
