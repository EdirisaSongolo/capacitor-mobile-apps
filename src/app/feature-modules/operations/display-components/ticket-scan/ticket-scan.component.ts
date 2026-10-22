import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { DateTokenDTO, TicketScanDTO } from '@public-events-core/api';
import { TicketStatus } from '@public-events-core/data-models';
import {
  retrieveUserGateCrewDates,
  scanUserTicket,
  userGateCrewDatesSelector,
} from '@public-events-core/store';

enum TicketScanDisplay {
  gate_crew_dates = 'GATE_CREW_DATES',
  ticket_scanner = 'TICKET_SCANNER',
}

@Component({
  selector: 'Tsk-ticket-scan',
  templateUrl: './ticket-scan.component.html',
  styleUrls: ['./ticket-scan.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TicketScanComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public scanFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  public scanDelay: number = 1500;
  public scannerAvailable: boolean = true;
  public userGateCrewDates: DateTokenDTO[] = [];
  public displayOptions: typeof TicketScanDisplay = TicketScanDisplay;
  public ticketScanDisplay: TicketScanDisplay =
    TicketScanDisplay.gate_crew_dates;
  public controlIcon: string =
    this.ticketScanDisplay === TicketScanDisplay.gate_crew_dates
      ? 'qr_code_scanner'
      : 'notes';

  private lastScannedTicketId: string;
  private gateCrewDate: DateTokenDTO;

  private userGateCrewDates$: Observable<DateTokenDTO[]> = this.store.select(
    userGateCrewDatesSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private appResponse: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userGateCrewDatesSub = this.userGateCrewDates$.subscribe(
      userGateCrewDates => (this.userGateCrewDates = [...userGateCrewDates])
    );

    this.subscriptions.add(userGateCrewDatesSub);

    this.store.dispatch(retrieveUserGateCrewDates());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public setGateCrewDate(dateToken: DateTokenDTO): void {
    this.gateCrewDate = dateToken;
    this.ticketScanDisplay = this.displayOptions.ticket_scanner;
    this.controlIcon = 'notes';
  }

  public updateDisplayPanel(): void {
    if (this.ticketScanDisplay === this.displayOptions.gate_crew_dates) {
      this.ticketScanDisplay = this.displayOptions.ticket_scanner;
      this.controlIcon = 'notes';
    } else if (this.ticketScanDisplay === this.displayOptions.ticket_scanner) {
      this.ticketScanDisplay = this.displayOptions.gate_crew_dates;
      this.controlIcon = 'qr_code_scanner';
    }
  }

  public processCameraPermission(hasPermission: boolean | null): void {
    this.scannerAvailable = hasPermission === true;

    if (hasPermission === false) {
      const messages: string[] = ['operations.ticket-scan.camera-denied'];
      this.appResponse.createAppResponse(AppResponseType.error, messages);
    } else if (hasPermission === null) {
      const messages: string[] = ['operations.ticket-scan.camera-unavailable'];
      this.appResponse.createAppResponse(AppResponseType.error, messages);
    }
  }

  public processTicketScan(userTicketId: string): void {
    if (userTicketId === this.lastScannedTicketId) {
      return;
    }

    this.lastScannedTicketId = userTicketId;

    const ticketScan: TicketScanDTO = {
      userTicketId: userTicketId,
      ticketStatus: TicketStatus.scanned,
    };

    this.store.dispatch(scanUserTicket({ ticketScan: ticketScan }));
  }
}
