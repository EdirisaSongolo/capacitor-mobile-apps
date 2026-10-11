import { CurrencyPipe } from '@angular/common';
import { ElementRef } from '@angular/core';

import { CurrencyDisplayDirective } from './currency-display.directive';

describe('CurrencyDisplayDirective', () => {
  it('should create an instance', () => {
    const element = new ElementRef(document.createElement('span'));
    const directive = new CurrencyDisplayDirective(
      element,
      new CurrencyPipe('en-US')
    );

    expect(directive).toBeTruthy();
  });
});
