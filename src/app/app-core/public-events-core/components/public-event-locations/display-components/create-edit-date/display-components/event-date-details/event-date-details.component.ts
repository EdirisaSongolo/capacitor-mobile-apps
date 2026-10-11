import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DateDetailsDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@app-core/public-events-core/api';
import {
  LocationDateAction,
  PublicEventAction,
} from '@app-core/public-events-core/data-models';
import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import {
  AppResponseService,
  BreakPointService,
  DateTimeService,
} from '@domain-services/index';
import { Store } from '@ngrx/store';

import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import {
  locationDateActionSelector,
  publicEventActionSelector,
  publicEventDateSelector,
  publicEventLocationSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import { updateEventDateDetails } from '@public-events-core/store';

@Component({
  selector: 'Tsk-event-date-details',
  templateUrl: './event-date-details.component.html',
  styleUrls: ['./event-date-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventDateDetailsComponent implements OnInit, OnDestroy {
  @Output() public appendDateDetails: EventEmitter<DateDetailsDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public dateDetails: DateDetailsDTO = {} as DateDetailsDTO;
  public minDate: Date = new Date();

  public dateTime = this.formBuilder.group({
    eventDate: [null as Date | Date, Validators.required],
    startTime: [null as Date | Date, Validators.required],
    endTime: [null as Date | Date, Validators.required],
  });

  public controlIcon = 'add';
  public deleteIcon = 'delete';
  public eventDateTickets = this.formBuilder.group({
    eventTickets: this.formBuilder.array<FormGroup>([
      this.formBuilder.group({
        ticketName: ['', Validators.required],
        ticketValue: ['', Validators.required],
      }),
    ]),
  });

  private publicEventAction: PublicEventAction;
  private locationDateAction: LocationDateAction;
  private publicEventDate: PublicEventDateDTO;
  private publicEventLocation: PublicEventLocationDTO;
  private maximumEventHours: number = 12;

  private publicEventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private locationDateAction$: Observable<LocationDateAction> =
    this.store.select(locationDateActionSelector);
  private publicEventLocation$: Observable<PublicEventLocationDTO> =
    this.store.select(publicEventLocationSelector);
  private publicEventDate$: Observable<PublicEventDateDTO> = this.store.select(
    publicEventDateSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const publicEventActionSub = this.publicEventAction$.subscribe(
      publicEventAction => {
        this.publicEventAction = publicEventAction;
      }
    );

    this.subscriptions.add(publicEventActionSub);

    const publicEventLocationSub = this.publicEventLocation$.subscribe(
      publicEventLocation => {
        this.publicEventLocation = publicEventLocation;
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const locationDateActionSub = this.locationDateAction$.subscribe(
      locationDateAction => {
        this.locationDateAction = locationDateAction;
      }
    );

    this.subscriptions.add(locationDateActionSub);

    const publicEventDateSub = this.publicEventDate$.subscribe(
      publicEventDate => {
        if (publicEventDate) {
          this.publicEventDate = { ...publicEventDate };
          this.setPublicEventDateValues();
        }
      }
    );

    this.subscriptions.add(publicEventDateSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get eventTickets() {
    return this.eventDateTickets.get('eventTickets') as FormArray;
  }

  public createTicketField(): void {
    const eventTickets = this.eventDateTickets.get('eventTickets') as FormArray;

    const formGroup: FormGroup = this.formBuilder.group({
      ticketName: ['', Validators.required],
      ticketValue: ['', Validators.required],
    });

    eventTickets.push(formGroup);
  }

  public removeTicketField(index: number): void {
    const eventTickets: FormArray = this.eventDateTickets.get(
      'eventTickets'
    ) as FormArray;
    eventTickets.removeAt(index);
  }

  public createEditPublicEventDate(): void {
    if (
      this.dateTime.invalid ||
      this.eventTickets.length === 0 ||
      this.eventTickets.invalid
    ) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'create-event.public-event.notifications.date-venue-tickets-required',
      ]);
      return;
    }

    const eventDate = this.dateTimeService.createApiDateFormat(
      this.dateTime.value.eventDate
    );
    const startTime = this.dateTimeService.createApiTimeFormat(
      this.dateTime.value.startTime
    );
    const endTime = this.dateTimeService.createApiTimeFormat(
      this.dateTime.value.endTime
    );

    const eventStart = DateTime.fromFormat(startTime, 'HH:mm:ss');
    let eventEnd = DateTime.fromFormat(endTime, 'HH:mm:ss');
    if (eventEnd <= eventStart) eventEnd = eventEnd.plus({ days: 1 });

    if (eventEnd.diff(eventStart, 'hours').hours > this.maximumEventHours) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'create-event.public-event.notifications.invalid-event-duration',
      ]);
      return;
    }

    const eventTickets: Record<string, number> = {};
    const eventTicketsForm = this.eventDateTickets.get(
      'eventTickets'
    ) as FormArray;
    eventTicketsForm.controls.forEach((control, index) => {
      const ticket = control as FormGroup;
      const ticketName = ticket.get('ticketName')?.value;
      const ticketValue = ticket.get('ticketValue')?.value as number;

      eventTickets[ticketName] = ticketValue;
    });

    this.dateDetails = {
      dateId:
        this.locationDateAction === LocationDateAction.create_date
          ? `tmp_${crypto.randomUUID()}`
          : this.publicEventDate.dateId,
      locationId: this.publicEventLocation.locationId,
      eventDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      eventTickets: eventTickets,
    };

    if (this.publicEventAction === PublicEventAction.create_event) {
      this.appendDateDetails.emit(this.dateDetails);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      if (this.locationDateAction === LocationDateAction.create_date) {
        this.appendDateDetails.emit(this.dateDetails);
      } else if (this.locationDateAction === LocationDateAction.edit_date) {
        this.store.dispatch(
          updateEventDateDetails({ dateDetails: this.dateDetails })
        );
      }
    }
  }

  private setPublicEventDateValues(): void {
    if (this.locationDateAction === LocationDateAction.edit_date) {
      this.dateTime.patchValue({
        eventDate: this.dateTimeService.createDateFormEntry(
          this.publicEventDate.eventDate
        ),
        startTime: this.dateTimeService.createTimeFormEntry(
          this.publicEventDate.startTime
        ),
        endTime: this.dateTimeService.createTimeFormEntry(
          this.publicEventDate.endTime
        ),
      });

      this.dateTime.markAsTouched();

      const eventTickets = this.eventDateTickets.get(
        'eventTickets'
      ) as FormArray;
      eventTickets.clear();
      const ticketsList = this.publicEventDate.eventTickets;
      Object.entries(ticketsList).forEach(([key, value]) => {
        const formGroup: FormGroup = this.formBuilder.group({
          ticketName: [key, Validators.required],
          ticketValue: [value, Validators.required],
        });

        eventTickets.push(formGroup);
      });
    }
  }
}
