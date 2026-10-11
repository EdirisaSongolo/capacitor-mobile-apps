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
import { KeyValue } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { Device } from '@domain-data-models/app-domain.enums';
import { DateTimeService } from '@domain-services/index';

import { PublicEventDateDTO } from '@public-events-core/api';
import { TransactionMetaData } from '@profile-revenue-core/api';

interface TicketSalesItem {
  index: number;
  ticketName: string;
  ticketValue: string;
  ticketPrice: number;
  ticketCount: number;
  countTotal: number;
}

@Component({
  selector: 'Tsk-ticket-sales',
  templateUrl: './ticket-sales.component.html',
  styleUrls: ['./ticket-sales.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TicketSalesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public publicEventDate: PublicEventDateDTO;
  @Input() public eventTickets: Map<string, number>;
  @Output() public closeDialog: EventEmitter<void> = new EventEmitter();
  @Output() public ticketSales: EventEmitter<TransactionMetaData[]> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public closeIcon: string = 'remove';

  public eventDate: string;
  public eventTime: string;

  public ticketSalesItems: TicketSalesItem[] = [];
  public ticketCount: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public totalTicketCount: number = 0;
  public totalTicketAmount: number = 0.0;

  private invoiceDetails: Map<number, TransactionMetaData> = new Map();

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
    const eventDateChanges = changes['publicEventDate'];
    if (eventDateChanges?.currentValue) {
      this.eventDate = this.dateTimeService.processApiDateResponse(
        this.publicEventDate.eventDate
      );

      this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
        this.publicEventDate.startTime,
        this.publicEventDate.endTime
      );
    }

    const ticketChanges = changes['eventTickets'];
    if (ticketChanges?.currentValue) {
      this.ticketSalesItems = this.processEventTickets(this.eventTickets);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public sortTickets(
    a: KeyValue<string, number>,
    b: KeyValue<string, number>
  ): number {
    return a.value - b.value;
  }

  public closeSalesDialog(): void {
    this.closeDialog.emit();
  }

  public updateTicketCount(itemIndex: number, ticketCount: number): void {
    const salesItem: TicketSalesItem = this.ticketSalesItems[itemIndex];

    this.totalTicketCount -= salesItem.ticketCount;
    this.totalTicketAmount -= salesItem.countTotal;

    salesItem.ticketCount = ticketCount;
    salesItem.countTotal = salesItem.ticketPrice * ticketCount;

    this.ticketSalesItems[itemIndex] = { ...salesItem };
    this.totalTicketCount += salesItem.ticketCount;
    this.totalTicketAmount += salesItem.countTotal;

    const metadata: TransactionMetaData = {
      name: salesItem.ticketName,
      quantity: salesItem.ticketCount,
      price: salesItem.ticketPrice,
      total: salesItem.ticketPrice * salesItem.ticketCount,
    };

    this.invoiceDetails.set(salesItem.index, metadata);
  }

  public createTicketSales(): void {
    const transactionDetails: TransactionMetaData[] = [];
    this.invoiceDetails.forEach(metaData => {
      transactionDetails.push(metaData);
    });

    this.ticketSales.emit(transactionDetails);
  }

  private processEventTickets(
    eventTickets: Map<string, number>
  ): TicketSalesItem[] {
    const ticketSales: TicketSalesItem[] = [];

    Array.from(eventTickets.entries())
      .sort(([a_key, a_value], [b_key, b_value]) => a_value - b_value)
      .forEach(([key, value], index) => {
        const ticketPrice = (value / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        const ticketSale: TicketSalesItem = {
          index: index,
          ticketName: key,
          ticketValue: ticketPrice,
          ticketPrice: value,
          ticketCount: 0,
          countTotal: 0.0,
        };

        ticketSales.push(ticketSale);
      });

    return ticketSales;
  }
}
