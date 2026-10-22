import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { VendorTokenDTO } from '@app-core/vendors-core/api';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { VendorsConstants } from '@app-core/vendors-core/data-models/vendors.constants';
import { ProfileDTO } from '@app-core/app-api';
import { Router } from '@angular/router';
import { VendorsRoutes } from '@vendors-core/data-models';
import { ProviderPlacDetails } from '@profile-accounts-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';

@Component({
  selector: 'Tsk-vendor-plac',
  templateUrl: './vendor-plac.component.html',
  styleUrls: ['./vendor-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorPlacComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public vendorToken: VendorTokenDTO;
  @Input() public profileDTO: ProfileDTO;
  @Output() public placAction: EventEmitter<VendorTokenDTO> =
    new EventEmitter();
  @Output() public removeAction: EventEmitter<VendorTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public actionOptions: typeof ComponentAction = ComponentAction;

  public removeIcon: string = 'remove';
  public vendorProfileImage: string = `url(${VendorsConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public vendorName: string;
  public displayOptions: boolean = false;
  public optionControl: string = 'more_vert';
  public providerPlacDetails: ProviderPlacDetails | null = null;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private router: Router,
    private profileProcessor: ProfileProcessorService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    this.processVendorData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const vendorChanges = changes['vendorToken'];
    this.vendorToken = vendorChanges?.currentValue;
    if (this.vendorToken) {
      this.processVendorData();
    }

    const profileDTOChanges = changes['profileDTO'];
    this.profileDTO = profileDTOChanges?.currentValue;
    if (this.profileDTO) {
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processPlacAction(): void {
    if (
      this.componentAction === ComponentAction.dashboard ||
      this.componentAction === ComponentAction.event_management
    ) {
      this.placAction.emit(this.vendorToken);
      return;
    }

    this.router.navigate([
      VendorsRoutes.VENDOR_PROFILE,
      this.vendorToken?.vendorProfileId,
    ]);
  }

  public emitRemoveAction() {
    this.removeAction.emit(this.vendorToken);
  }

  public toggleOptions(): void {
    this.displayOptions = !this.displayOptions;
  }

  private processVendorData(): void {
    if (this.vendorToken?.profileImage) {
      const imagePath = this.vendorToken?.profileImage;
      this.vendorProfileImage = `url(${imagePath}) center / contain no-repeat`;
    }

    this.vendorName = this.vendorToken?.vendorName;

    const providerPlacDetails =
      this.profileProcessor.processProviderPlacDetails(this.vendorToken);
    this.providerPlacDetails = providerPlacDetails;
  }
}
