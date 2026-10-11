import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';
import { DateTokenDTO } from '@app-core/public-events-core/api';
import { PublicEventConstants } from '@app-core/public-events-core/data-models';
import { DateTime } from 'luxon';

@Component({
  selector: 'Tsk-public-event-date-plac',
  templateUrl: './public-event-date-plac.component.html',
  styleUrls: ['./public-event-date-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventDatePlacComponent implements OnInit, OnDestroy {
  @Input() public componentAction: ComponentAction;
  @Input() public profileImage: string | File;
  @Input() public dateToken: DateTokenDTO;
  @Output() public placAction: EventEmitter<DateTokenDTO> = new EventEmitter();
  @Output() public deleteAction: EventEmitter<DateTokenDTO> =
    new EventEmitter();

  public posterImagePath: string = `url(${PublicEventConstants.DEFAULT_PROFILE_IMAGE}) 50% 10% / 10rem no-repeat`;
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public actionOptions: typeof ComponentAction = ComponentAction;
  public removeIcon: string = 'remove';
  public posterImage: string;
  public eventVenue: string;
  public eventDate: string;
  public eventTime: string;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const posterChanges = changes['profileImage'];
    if (posterChanges) {
      this.displayPublicEventPoster();
    }

    const dateChanges = changes['dateToken'];
    if (dateChanges) {
      this.processPublicEventDate();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public emitPublicEventDateDTO(): void {
    this.placAction.emit(this.dateToken);
  }

  public initiateDeleteAction(): void {
    this.deleteAction.emit(this.dateToken);
  }

  private processPublicEventDate(): void {
    this.eventDate = DateTime.fromISO(this.dateToken.eventDate).toFormat(
      'MMM dd, yyyy'
    );

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      this.dateToken.startTime,
      this.dateToken.endTime
    );

    this.eventVenue = this.dateToken?.venueName;
  }

  private displayPublicEventPoster(): void {
    if (this.profileImage) {
      const posterImage = this.profileImage;

      if (typeof posterImage === 'object') {
        const reader = new FileReader();
        reader.onload = file => {
          const posterImage = file.target.result as string;
          this.posterImagePath = `url(${posterImage}) center/ contain no-repeat`;
        };
        reader.readAsDataURL(posterImage as File);
      } else {
        const imagePath: string = this.profileImage as string;
        this.posterImagePath = `url(${imagePath}) center/ contain no-repeat`;
      }
    }
  }
}
