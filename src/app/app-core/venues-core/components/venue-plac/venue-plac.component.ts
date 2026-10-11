import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { VenueTokenDTO } from '@app-core/venues-core/api';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { VenuesConstants } from '@app-core/venues-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { Router } from '@angular/router';
import { VenuesRoutes } from '@venues-core/data-models/venues.routes';
import { ProviderPlacDetails } from '@profile-accounts-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';

@Component({
  selector: 'Tsk-venue-plac',
  templateUrl: './venue-plac.component.html',
  styleUrls: ['./venue-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class VenuePlacComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public venueToken: VenueTokenDTO;
  @Input() public profileDTO: ProfileDTO;
  @Output() public placAction: EventEmitter<VenueTokenDTO> = new EventEmitter();
  @Output() public removeAction: EventEmitter<VenueTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public actionOptions: typeof ComponentAction = ComponentAction;

  public removeIcon: string = 'remove';
  public venueProfileImage: string = `url(${VenuesConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public venueName: string;
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
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const venueChanges = changes['venueToken'];
    this.venueToken = venueChanges?.currentValue;
    if (this.venueToken) {
      this.processVenueData();
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
      this.placAction.emit(this.venueToken);
      return;
    }

    this.router.navigate([
      VenuesRoutes.VENUE_PROFILE,
      this.venueToken.venueProfileId,
    ]);
  }

  public emitRemoveAction() {
    this.removeAction.emit(this.venueToken);
  }

  public toggleOptions(): void {
    this.displayOptions = !this.displayOptions;
  }

  private processVenueData(): void {
    if (this.venueToken?.profileImage) {
      const imagePath = this.venueToken.profileImage;
      this.venueProfileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.venueName = this.venueToken?.venueName;

    const providerPlacDetails =
      this.profileProcessor.processProviderPlacDetails(this.venueToken);
    this.providerPlacDetails = providerPlacDetails;
  }
}
