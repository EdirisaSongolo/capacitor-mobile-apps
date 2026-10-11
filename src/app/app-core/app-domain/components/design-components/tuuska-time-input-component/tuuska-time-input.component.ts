import {
  Component,
  forwardRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';

let nextId = 0;

@Component({
  selector: 'Tsk-time-input-component',
  templateUrl: './tuuska-time-input.component.html',
  styleUrls: ['./tuuska-time-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TuuskaTimeInputComponent),
      multi: true,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        ...MAT_NATIVE_DATE_FORMATS,
        display: {
          ...MAT_NATIVE_DATE_FORMATS.display,
          timeInput: { hour: 'numeric', minute: 'numeric', hour12: true },
          timeOptionLabel: { hour: 'numeric', minute: 'numeric', hour12: true },
        },
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TuuskaTimeInputComponent implements ControlValueAccessor {
  @Input() public required: boolean = false;
  @Input() public label: string = '';
  @Input() public errorMessage: string | null = null;
  @Input() public align: 'left' | 'center' = 'left';

  readonly inputId = `app-time-input-${nextId++}`;
  readonly interval: string = '15m';
  public value: Date | null = null;
  public focused = false;
  public disabled = false;

  private onChange(value: Date | null): void {}

  private onTouched(): void {}

  constructor() {}

  public writeValue(value: Date | null): void {
    this.value = value ?? null;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onTimeChange(value: Date | null): void {
    this.value = value;
    this.onChange(this.value);
  }

  public onFocus(): void {
    this.focused = true;
  }

  public onBlur(): void {
    this.focused = false;
    this.onTouched();
  }
}
