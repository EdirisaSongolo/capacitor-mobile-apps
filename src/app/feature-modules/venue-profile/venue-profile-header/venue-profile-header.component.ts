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
import { VenuesConstants } from '@venues-core/data-models';
import { VenueTokenDTO } from '@venues-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { serviceProviderSelector } from '@profile-accounts-core/store';

@Component({
  selector: 'Tsk-venue-profile-header',
  templateUrl: './venue-profile-header.component.html',
  styleUrls: ['./venue-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueProfileHeaderComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `url(${VenuesConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public apps: string = 'crop_free';

  public venueName: string;
  public venueAddress: string;
  public venueLocation: string;
  public venueDescription: string;

  private serviceProvider: ServiceProviderDTO;
  private venueToken: VenueTokenDTO;

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
          this.venueToken = this.serviceProvider as VenueTokenDTO;
          this.processVenueTokenDTO(this.venueToken);
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private processVenueTokenDTO(venueToken: VenueTokenDTO): void {
    if (venueToken?.profileImage) {
      const imagePath = venueToken?.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;

      this.venueName = venueToken.venueName;

      const vendorLocation = venueToken.venueLocation;
      const vendorCity = vendorLocation.city;
      const vendorState = vendorLocation.state;
      this.venueAddress = vendorLocation.address;
      this.venueLocation = `${vendorCity}, ${vendorState}`;

      this.venueDescription = venueToken.venueDescription;
    }
  }
}
