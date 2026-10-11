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
import { PrivateEventTokenDTO } from '@app-core/private-events-core/api';
import { PrivateEventConstants } from '@app-core/private-events-core/data-models';
import {
  ComponentAction,
  Device,
  UserEventAccess,
} from '@domain-data-models/app-domain.enums';
import { DateTimeService } from '@domain-services/date-time/date-time.service';
import { BreakPointService } from '@domain-services/index';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-private-event-plac',
  templateUrl: './private-event-plac.component.html',
  styleUrls: ['./private-event-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventPlacComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public privateEventToken: PrivateEventTokenDTO;
  @Output() public placAction: EventEmitter<PrivateEventTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public accessOptions: typeof UserEventAccess = UserEventAccess;

  public previewFields: any = {
    eventName: 'create-event.private-event.preview-fields.event-name',
    profileImage: `url(${PrivateEventConstants.DEFAULT_PROFILE_IMAGE}) 50% 10% / 10rem no-repeat`,
    eventAddress: 'create-event.private-event.preview-fields.event-address',
    eventDate: 'create-event.private-event.preview-fields.event-date',
    eventTime: 'create-event.private-event.preview-fields.event-time',
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
    const privateEventChanges = changes['privateEventToken'];
    this.privateEventToken = privateEventChanges?.currentValue;
    if (this.privateEventToken) {
      this.preparePreviewFields(this.privateEventToken);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private preparePreviewFields(privateEventToken: PrivateEventTokenDTO): void {
    const eventName = privateEventToken?.eventName;
    if (eventName) {
      this.previewFields.eventName = eventName;
    }

    const profileImage = privateEventToken?.profileImage;
    if (profileImage) {
      this.previewFields.profileImage = `url(${profileImage}) center/ contain no-repeat`;
    }

    const eventTime = this.dateTimeService.processApiTimeRangeResponse(
      privateEventToken?.startTime,
      privateEventToken?.endTime
    );
    if (eventTime) {
      this.previewFields.eventTime = eventTime;
    }

    const eventDate = privateEventToken.eventDate;
    if (eventDate) {
      this.previewFields.eventDate =
        this.dateTimeService.processApiDateResponse(eventDate);
    }

    // const eventVenue = this.privateEventToken?.eventLocation?.eventVenue;
    // let eventAddress;
    // if (eventVenue) {
    //   eventAddress =
    //     eventVenue?.venueType === VenueType.private_venue
    //       ? eventVenue?.privateAddress
    //       : eventVenue?.publicVenue?.venueLocation?.address;
    // } else {
    //   eventAddress = ;
    // }

    // this.previewFields.profileImage =
    //   profileImage && profileImage != null
    //     ?
    //     : ;

    // this.previewFields.eventAddress = eventAddress;
  }

  public processPlacAction(): void {
    this.placAction.emit(this.privateEventToken);
  }
}
