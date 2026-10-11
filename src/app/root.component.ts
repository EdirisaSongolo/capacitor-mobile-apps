import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { SideNavService } from '@domain-services/side-nav/side-nav.service';
import { BreakPointService } from '@app-core/app-domain/domain-services/break-point/break-point.service';

@Component({
  selector: 'Tsk-Root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RootComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public sideNavBackDrop = true;
  public sideNavPosition: 'start' | 'end' = 'end';
  public sideNavMode: MatDrawerMode = 'over';
  public sideNavStatus = false;

  private sideNavSubscription: Observable<boolean> =
    this.sideNav.isOpenSubscription;
  private subscriptions = new Subscription();

  constructor(
    private breakpoint: BreakpointObserver,
    private translator: TranslateService,
    private sideNav: SideNavService,
    private breakPoint: BreakPointService
  ) {}

  public ngOnInit(): void {
    this.configureI18n();

    const breakpointSubscription = this.breakpoint
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.WebLandscape,
      ])
      .subscribe(results => {
        const breakpoints = results.breakpoints;

        if (
          breakpoints[Breakpoints.HandsetPortrait] ||
          breakpoints[Breakpoints.HandsetLandscape] ||
          breakpoints[Breakpoints.TabletPortrait]
        ) {
          this.device = Device.mobile;
          this.breakPoint.updateDeviceSubject(Device.mobile);
        }

        if (
          breakpoints[Breakpoints.TabletLandscape] ||
          breakpoints[Breakpoints.Web]
        ) {
          this.device = Device.desktop;
          this.breakPoint.updateDeviceSubject(Device.desktop);
        }
      });

    this.subscriptions.add(breakpointSubscription);

    const navSubscription = this.sideNavSubscription.subscribe(isOpen => {
      this.sideNavStatus = isOpen;
    });

    this.subscriptions.add(navSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public configureI18n(): void {
    this.translator.addLangs(['us-english']);
    this.translator.setDefaultLang('us-english');
    this.translator.use('us-english');
  }
}
