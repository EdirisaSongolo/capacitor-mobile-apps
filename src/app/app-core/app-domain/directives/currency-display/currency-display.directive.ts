import { CurrencyPipe } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[TskCurrencyDisplay]',
  providers: [CurrencyPipe],
  standalone: false,
})
export class CurrencyDisplayDirective implements OnChanges {
  @Input('TskCurrencyDisplay') public amountInCents: number | null = null;
  public currencyCode: string = 'USD';
  public symbol: string = 'symbol';
  public digitsInfo: string = '1.2-2';

  constructor(
    private element: ElementRef<HTMLElement>,
    private currencyPipe: CurrencyPipe
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.displayCurrencyAmount();
  }

  private displayCurrencyAmount(): void {
    if (this.amountInCents == null || isNaN(this.amountInCents)) {
      this.element.nativeElement.textContent = '';
      return;
    }

    const amount = this.amountInCents / 100;
    const formattedAmount = this.currencyPipe.transform(
      amount,
      this.currencyCode,
      this.symbol,
      this.digitsInfo
    );

    this.element.nativeElement.textContent = formattedAmount ?? '';
  }
}
