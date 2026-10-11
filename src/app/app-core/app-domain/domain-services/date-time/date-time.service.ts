import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  private apiDateFormat: string = 'yyyy-MM-dd';
  private apiTimeFormat: string = 'HH:mm:ss';

  private uiDateFormat: string = 'MMM dd, yyyy';
  private uiTimeFormat: string = 'hh:mm a';

  constructor() {}

  public processApiTimeResponse(timeString: string): string {
    if (!timeString) return null;

    return DateTime.fromISO(timeString).toFormat(this.uiTimeFormat);
  }

  public processApiTimeRangeResponse(
    startTime: string,
    endTime: string
  ): string {
    if (!startTime || !endTime) return null;

    const eventStart = this.processApiTimeResponse(startTime);
    const eventEnd = this.processApiTimeResponse(endTime);
    return `${eventStart} - ${eventEnd}`;
  }

  public processApiDateResponse(dateString: string): string {
    if (!dateString) return null;

    return DateTime.fromFormat(dateString, this.apiDateFormat).toFormat(
      this.uiDateFormat
    );
  }

  public createApiTimeFormat(timeString: Date): string {
    return DateTime.fromJSDate(new Date(timeString)).toFormat(
      this.apiTimeFormat
    );
  }

  public createApiDateFormat(dateString: Date): string {
    return DateTime.fromJSDate(new Date(dateString)).toFormat(
      this.apiDateFormat
    );
  }

  public createTimeFormEntry(timeString: string): Date {
    return DateTime.fromISO(timeString).toJSDate();
  }

  public createDateFormEntry(dateString: string): Date {
    return DateTime.fromFormat(dateString, this.apiDateFormat).toJSDate();
  }
}
