import {
  Component,
  forwardRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

let nextId = 0;

@Component({
  selector: 'Tsk-location-input-component',
  templateUrl: './tuuska-location-input.component.html',
  styleUrls: ['./tuuska-location-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TuuskaLocationInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TuuskaLocationInputComponent implements ControlValueAccessor {
  @Input() public required: boolean = false;
  @Input() public label: string = '';
  @Input() public errorMessage: string | null = null;
  @Input() public align: 'left' | 'center' = 'left';
  @Input() public suggestions: string[] | null = null;

  readonly inputId = `app-location-input-${nextId++}`;
  public value = '';
  public focused = false;
  public disabled = false;

  private onChange(value: string): void {}

  private onTouched(): void {}

  constructor() {}

  public writeValue(value: string): void {
    this.value = value ?? '';
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

  public onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.value = event.option.value;
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
