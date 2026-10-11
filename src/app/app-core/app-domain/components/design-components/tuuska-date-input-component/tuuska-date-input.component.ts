import {
  Component,
  forwardRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

let nextId = 0;

@Component({
  selector: 'Tsk-date-input-component',
  templateUrl: './tuuska-date-input.component.html',
  styleUrls: ['./tuuska-date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TuuskaDateInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TuuskaDateInputComponent implements ControlValueAccessor {
  @Input() public required: boolean = false;
  @Input() public label: string = '';
  @Input() public errorMessage: string | null = null;
  @Input() public align: 'left' | 'center' = 'left';
  @Input() public min: Date | null = null;
  @Input() public max: Date | null = null;

  readonly inputId = `app-date-input-${nextId++}`;
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

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.value = event.value;
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
