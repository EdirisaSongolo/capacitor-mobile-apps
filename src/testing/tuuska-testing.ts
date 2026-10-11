import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Imported from the module directly rather than the `@core-modules` barrel,
// which also re-exports `app-store` and `root-routing` — that would pull the
// real NgRx store setup and root router into every spec and fight the mock
// store configured below.
import { MaterialImportsModules } from '@core-modules/material-imports/material-imports.module';
import { CurrencyDisplayDirective } from '@app-domain/directives';
import {
  TuuskaDateInputComponent,
  TuuskaInputComponent,
  TuuskaLocationInputComponent,
} from '@app-domain/components/design-components';

interface TuuskaTestConfig {
  declarations?: any[];
  imports?: any[];
  providers?: any[];
}

/**
 * The custom input components are declared for every spec rather than relying
 * on `CUSTOM_ELEMENTS_SCHEMA`. A template that binds `formControlName` to one
 * of them needs its real `ControlValueAccessor`; an unrecognised custom element
 * has none, which fails with NG01203. They are declared directly rather than by
 * importing `AppDomainModule`, because that module also pulls in
 * `StoreModule.forFeature`, which expects a real root store and would conflict
 * with the mock store below. `CurrencyDisplayDirective` is here for the same
 * reason — templates bind to it as `[TskCurrencyDisplay]`, which the schema
 * cannot satisfy.
 */
const sharedDeclarations = [
  TuuskaInputComponent,
  TuuskaDateInputComponent,
  TuuskaLocationInputComponent,
  CurrencyDisplayDirective,
];

/**
 * Shared TestBed setup for the app's component and directive specs.
 *
 * Most specs in this app are shallow "does it instantiate" tests, but the
 * components they cover inject the NgRx store, use translated labels and rely
 * on Material directives. Rather than repeating that setup in every spec, this
 * configures the dependencies they all share:
 *
 *  - a mock NgRx store, so components that select state can be constructed
 *  - `TranslateModule`, for `TranslateService` and the `translate` pipe
 *  - the router, which also supplies `ActivatedRoute`
 *  - the app's Material imports, plus ngx-mask for masked inputs
 *  - `CUSTOM_ELEMENTS_SCHEMA`, so unknown child components in a template don't
 *    fail the test — these specs deliberately don't render their children
 *
 * Pass `declarations`, `imports` or `providers` to add to (not replace) the
 * shared setup. To give the store real state for a specific spec, inject
 * `MockStore` and use `overrideSelector`.
 */
export async function configureTuuskaTest(
  config: TuuskaTestConfig = {}
): Promise<void> {
  await TestBed.configureTestingModule({
    declarations: [
      ...new Set([...sharedDeclarations, ...(config.declarations ?? [])]),
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forRoot(),
      MaterialImportsModules,
      NgxMaskDirective,
      // `provideRouter` supplies the router services; `RouterModule` supplies
      // the `routerLink` / `router-outlet` directives templates bind to.
      RouterModule,
      ...(config.imports ?? []),
    ],
    providers: [
      provideMockStore({}),
      provideRouter([]),
      provideNgxMask(),
      ...(config.providers ?? []),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  }).compileComponents();
}
