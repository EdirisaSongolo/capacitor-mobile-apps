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
import {
  PublicEventTokenDTO,
  TokenLocationDate,
} from '@app-core/public-events-core/api';
import { PublicEventConstants } from '@app-core/public-events-core/data-models';
import {
  ComponentAction,
  Device,
  UserEventAccess,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-public-event-plac',
  templateUrl: './public-event-plac.component.html',
  styleUrls: ['./public-event-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventPlacComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public publicEventToken: PublicEventTokenDTO;
  @Output() public placAction: EventEmitter<PublicEventTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public accessOptions: typeof UserEventAccess = UserEventAccess;

  public previewFields: any = {
    name: 'create-event.public-event.preview-fields.event-name',
    profileImage: `url(${PublicEventConstants.DEFAULT_PROFILE_IMAGE}) 50% 10% / 10rem no-repeat`,
    location: 'create-event.public-event.preview-fields.event-location',
    date: 'create-event.public-event.preview-fields.event-date',
    fee: 'create-event.public-event.preview-fields.event-fee',
  };

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private translator: TranslateService,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const publicEventChanges = changes['publicEventToken'];
    this.publicEventToken = publicEventChanges?.currentValue;
    if (this.publicEventToken) {
      this.preparePreviewFields();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processPlacAction(): void {
    this.placAction.emit(this.publicEventToken);
  }

  private preparePreviewFields(): void {
    const name: string = this.publicEventToken?.eventName;
    if (name) this.previewFields.name = name;

    const profileImage = this.publicEventToken?.profileImage;
    if (profileImage)
      this.previewFields.profileImage = `url(${profileImage}) center/ contain no-repeat`;

    const tokenLocationDate: TokenLocationDate =
      this.publicEventToken?.tokenLocationDate;
    if (tokenLocationDate) {
      const location = tokenLocationDate.eventLocation.city;
      this.previewFields.location = location;

      const eventDate = tokenLocationDate.eventDate;
      const date = this.dateTimeService.processApiDateResponse(eventDate);
      this.previewFields.date = date;

      const eventTickets = tokenLocationDate.eventTickets;
      const ticketFees = Object.entries(eventTickets)
        .sort(([a_key, a_value], [b_key, b_value]) => a_value - b_value)
        .map(([key, value]) => `${key}: ${(value / 100).toFixed(2)}`)
        .join(', ');

      this.previewFields.fee = ticketFees;
    }
  }
}
