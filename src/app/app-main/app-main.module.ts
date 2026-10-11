import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppMainRoutingModule } from '@app-main/app-main-routing.module';

import { AppMainComponent } from '@app-main/app-main/app-main.component';
import { AppHeaderComponent } from '@app-main/display-components/app-header/app-header.component';
import { AppNavigationComponent } from '@app-main/display-components/app-navigation/app-navigation.component';
import { AppDisplayComponent } from '@app-main/display-components/app-display/app-display.component';
import { AppFooterComponent } from '@app-main/display-components/app-footer/app-footer.component';
import { SideNavigationComponent } from '@app-main/display-components/side-navigation/side-navigation.component';

@NgModule({
  declarations: [
    AppMainComponent,
    AppHeaderComponent,
    AppNavigationComponent,
    AppDisplayComponent,
    AppFooterComponent,
    SideNavigationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppMainRoutingModule,
  ],
  exports: [SideNavigationComponent],
})
export class AppMainModule {}
