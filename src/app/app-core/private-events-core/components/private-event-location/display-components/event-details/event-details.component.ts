import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { Store } from '@ngrx/store';
import {
  DateTimeAction,
  PrivateEventAction,
} from '@private-events-core/data-models';
import {
  dateTimeActionSelector,
  privateEventDateSelector,
  privateEventStartTimeSelector,
  privateEventEndTimeSelector,
  privateEventActionSelector,
  privateEventHostSelector,
  updatePrivateEventDetails,
} from '@private-events-core/store/create-edit-event';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { UserTokenDTO } from '@user-profile-core/api';
import { DateTimeService } from '@domain-services/index';
import { UserSearch } from '@user-profile-core/data-models';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { userProfileInfoSelector } from '@core-modules';
import { EventUpdateDTO } from '@private-events-core/api';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';

enum DisplayPanel {
  event_details = 'EVENT_DETAILS',
  user_socials = 'USER_SOCIALS',
}

@Component({
  selector: 'Tsk-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  @Output() public appendDateDetails: EventEmitter<any> = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: DisplayPanel = DisplayPanel.event_details;
  public displayOptions: typeof DisplayPanel = DisplayPanel;

  public hostCreated: boolean = false;
  public eventHost: UserTokenDTO;
  public editIcon: string = 'edit';
  public detailsIcon: string = 'notes';
  public userSearch: UserSearch = UserSearch.user_socials;

  public dateDetails: any = {};
  public minDate: Date = new Date();
  public dateTimeForm = this.formBuilder.group({
    eventDate: [null as Date | Date, Validators.required],
    startTime: [null as Date | Date, Validators.required],
    endTime: [null as Date | Date, Validators.required],
  });
  private maximumEventHours: number = 12;

  private profileDTO: ProfileDTO;
  private privateEventAction: PrivateEventAction;
  private dateAction: DateTimeAction;
  private startTime: string;
  private endTime: string;
  private eventDate: string;

  private userProfileInfo: UserProfileInfo;

  private privateEventAction$: Observable<PrivateEventAction> =
    this.store.select(privateEventActionSelector);
  private dateAction$: Observable<DateTimeAction> = this.store.select(
    dateTimeActionSelector
  );
  private eventHost$: Observable<UserTokenDTO> = this.store.select(
    privateEventHostSelector
  );
  private profile$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private startTime$: Observable<string> = this.store.select(
    privateEventStartTimeSelector
  );
  private endTime$: Observable<string> = this.store.select(
    privateEventEndTimeSelector
  );
  private eventDate$: Observable<string> = this.store.select(
    privateEventDateSelector
  );
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private dateTime: DateTimeService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => (this.userProfileInfo = userProfileInfo)
    );

    this.subscriptions.add(userProfileInfoSub);

    const profileSub = this.profile$.subscribe(
      profileDTO => (this.profileDTO = profileDTO)
    );

    this.subscriptions.add(profileSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEventAction => (this.privateEventAction = privateEventAction)
    );

    this.subscriptions.add(privateEventActionSub);

    const dateActionSub = this.dateAction$.subscribe(
      dateAction => (this.dateAction = dateAction)
    );

    this.subscriptions.add(dateActionSub);

    const timeDateSub = combineLatest([
      this.startTime$,
      this.endTime$,
      this.eventDate$,
    ]).subscribe(([startTime, endTime, eventDate]) => {
      if (startTime && endTime && eventDate) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventDate = eventDate;
        this.setPublicEventDateValues();
      }
    });

    this.subscriptions.add(timeDateSub);

    const eventHostSub = this.eventHost$.subscribe(eventHost => {
      if (eventHost) {
        this.hostCreated = true;
        this.eventHost = { ...eventHost };
      }
    });

    this.subscriptions.add(eventHostSub);

    this.subscribeToFormsChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayHostSelection(): void {
    this.hostCreated = false;
    this.eventHost = null;
  }

  public selfHostedEvent(): void {
    const userToken: UserTokenDTO = {
      profile: Profiles.userProfile,
      userProfileId: this.userProfileInfo.userProfileId,
      firstName: this.userProfileInfo.firstName,
      lastName: this.userProfileInfo.lastName,
      userName: this.userProfileInfo.userName,
      profileImage: this.userProfileInfo.profileImage,
      userBiography: this.userProfileInfo.userBiography,
    };

    this.eventHost = userToken;
    this.hostCreated = true;
    this.displayPanel = this.displayOptions.event_details;
  }

  public displayUserSocials(): void {
    this.displayPanel = this.displayOptions.user_socials;
  }

  public updateDisplayPanel(): void {
    this.displayPanel = this.displayOptions.event_details;
  }

  public setEventHost(userToken: UserTokenDTO): void {
    this.eventHost = { ...userToken };
    this.hostCreated = true;
    this.displayPanel = this.displayOptions.event_details;
  }

  public createEditEventDate(): void {
    if (this.dateTimeForm.invalid) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'create-event.private-event.notifications.date-time-required',
      ]);
      return;
    }

    const startTime = this.dateTime.createApiTimeFormat(
      this.dateTimeForm.value.startTime
    );
    const endTime = this.dateTime.createApiTimeFormat(
      this.dateTimeForm.value.endTime
    );

    const eventStart = DateTime.fromFormat(startTime, 'HH:mm:ss');
    let eventEnd = DateTime.fromFormat(endTime, 'HH:mm:ss');
    if (eventEnd <= eventStart) eventEnd = eventEnd.plus({ days: 1 });

    if (eventEnd.diff(eventStart, 'hours').hours > this.maximumEventHours) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'create-event.private-event.notifications.invalid-event-duration',
      ]);
      return;
    }

    const formDate = this.dateTimeForm.value.eventDate;
    const eventDate = this.dateTime.createApiDateFormat(formDate);

    this.dateDetails = {
      eventHost: this.eventHost,
      startTime: startTime,
      endTime: endTime,
      eventDate: eventDate,
    };

    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.appendDateDetails.emit(this.dateDetails);
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      const eventUpdateDTO: EventUpdateDTO = {
        eventId: this.profileDTO.profileId,
        startTime: startTime,
        endTime: endTime,
        eventDate: eventDate,
        eventHost: this.eventHost,
      };

      this.store.dispatch(
        updatePrivateEventDetails({ eventUpdateDTO: eventUpdateDTO })
      );
    }
  }

  private subscribeToFormsChanges(): void {
    this.dateTimeForm.get('startTime')?.valueChanges.subscribe(startTime => {
      this.startTime = this.dateTime.createApiTimeFormat(startTime);
    });

    this.dateTimeForm.get('endTime')?.valueChanges.subscribe(endTime => {
      this.endTime = this.dateTime.createApiTimeFormat(endTime);
    });

    this.dateTimeForm.get('eventDate')?.valueChanges.subscribe(eventDate => {
      const privateEventDate = this.dateTime.createApiDateFormat(eventDate);
      this.eventDate = privateEventDate;
    });
  }

  private setPublicEventDateValues(): void {
    if (this.dateAction === DateTimeAction.edit_date) {
      this.dateTimeForm.patchValue({
        startTime: this.dateTime.createTimeFormEntry(this.startTime),
        endTime: this.dateTime.createTimeFormEntry(this.endTime),
        eventDate: this.dateTime.createDateFormEntry(this.eventDate),
      });
    }
  }
}
