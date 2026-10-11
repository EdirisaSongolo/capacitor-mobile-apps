import {
  Component,
  forwardRef,
  Input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NGX_MASK_CONFIG } from 'ngx-mask';

let nextId = 0;

@Component({
  selector: 'Tsk-input-component',
  templateUrl: './tuuska-input.component.html',
  styleUrls: ['./tuuska-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TuuskaInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TuuskaInputComponent implements ControlValueAccessor {
  @Input() public required: boolean = false;
  @Input() public label: string = '';
  @Input() public type: 'text' | 'email' | 'password' | 'number' | 'tel' =
    'text';
  @Input() public errorMessage: string | null = null;
  @Input() public autocomplete: string = 'off';
  @Input() public align: 'left' | 'center' = 'left';
  @Input() public mask: string | null = null;
  @Input() public maxlength: number | null = null;
  @Input() public money: boolean = false;

  private readonly maskConfig = inject(NGX_MASK_CONFIG, { optional: true });

  readonly inputId = `app-input-${nextId++}`;
  public value = '';
  public focused = false;
  public disabled = false;
  public passwordVisible = false;

  private onChange(value: string | number | null): void {}

  private onTouched(): void {}

  constructor() {}

  public get inputType(): string {
    if (this.type === 'password') {
      return this.passwordVisible ? 'text' : 'password';
    }
    return this.type;
  }

  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  public writeValue(value: string | number): void {
    if (this.money) {
      this.value =
        value === null || value === undefined || value === ''
          ? ''
          : (Number(value) / 100).toFixed(2);
      return;
    }

    this.value = (value as string) ?? '';
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

    if (this.money) {
      this.onChange(this.toCents(this.value));
      return;
    }

    this.onChange(this.mask ? this.stripMaskLiterals(this.value) : this.value);
  }

  public onFocus(): void {
    this.focused = true;
  }

  public onBlur(): void {
    this.focused = false;

    if (this.money && this.value !== '') {
      const cents = this.toCents(this.value);
      this.value = cents === null ? '' : (cents / 100).toFixed(2);
    }

    this.onTouched();
  }

  private stripMaskLiterals(value: string): string {
    const literals = this.maskConfig?.specialCharacters ?? [];

    return literals.reduce(
      (stripped: string, literal: string) => stripped.split(literal).join(''),
      value
    );
  }

  private toCents(value: string): number | null {
    const amount = value.replace(/[^0-9.]/g, '');

    if (amount === '' || Number.isNaN(Number(amount))) {
      return null;
    }

    return Math.round(Number(amount) * 100);
  }
}
