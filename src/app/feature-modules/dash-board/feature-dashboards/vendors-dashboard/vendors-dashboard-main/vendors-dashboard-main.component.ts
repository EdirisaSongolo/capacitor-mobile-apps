import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { VendorTokenDTO } from '@app-core/vendors-core/api/vendors.dto-models';
import {
  managedVendorsSelector,
  retrieveUserManagedVendors,
  setVendorsDetailsDisplay,
} from '@vendors-core/store';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsDisplay } from '@app-core/vendors-core/data-models';

export enum VendorsMainDisplays {
  create_vendor = 'create_vendor',
  vendors_list = 'vendors_list',
}

@Component({
  selector: 'Tsk-vendors-dashboard',
  templateUrl: './vendors-dashboard-main.component.html',
  styleUrls: ['./vendors-dashboard-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorsDashboardMainComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.dashboard;
  public displayPanel: VendorsMainDisplays = VendorsMainDisplays.vendors_list;
  public panelOptions: typeof VendorsMainDisplays = VendorsMainDisplays;

  public vendorsControls: any[] = [
    {
      name: 'vendors-dashboard.navigation.main.vendors-list',
      display: VendorsMainDisplays.vendors_list,
    },
    {
      name: 'vendors-dashboard.navigation.main.create-vendor',
      display: VendorsMainDisplays.create_vendor,
    },
  ];

  public managedVendors: VendorTokenDTO[] = [];
  public detailsDisplay: DetailsDisplay = DetailsDisplay.CREATE_VENDOR;

  private managedVendors$: Observable<VendorTokenDTO[]> = this.store.select(
    managedVendorsSelector
  );

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const managedVendorsSub = this.managedVendors$.subscribe(managedVendors => {
      if (managedVendors.length >= 1) {
        this.managedVendors = managedVendors;
        this.displayPanel = this.panelOptions.vendors_list;
      } else {
        this.displayPanel = this.panelOptions.create_vendor;
      }
    });

    this.subscriptions.add(managedVendorsSub);

    this.store.dispatch(retrieveUserManagedVendors());
    this.store.dispatch(
      setVendorsDetailsDisplay({ detailsDisplay: DetailsDisplay.CREATE_VENDOR })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateDisplayPanel(displayPanel: VendorsMainDisplays): void {
    this.displayPanel = displayPanel;
  }

  public vendorProfileDashboard(vendor: VendorTokenDTO): void {
    this.router.navigate(['profile', vendor.vendorProfileId], {
      relativeTo: this.activatedRoute,
    });
  }
}
