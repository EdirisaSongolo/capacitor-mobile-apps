import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { DashBoardRoutingModule } from '@dash-board/dash-board.routing.module';

import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';

import { DashBoardComponent } from '@dash-board/dash-board/dash-board.component';
import {
  DashBoardAppsComponent,
  DashBoardControlsComponent,
  ProfileManagementComponent,
} from '@dash-board/display-components';

@NgModule({
  declarations: [
    DashBoardComponent,
    DashBoardControlsComponent,
    DashBoardAppsComponent,
    ProfileManagementComponent,
  ],
  imports: [
    CommonModule,
    MaterialImportsModules,
    TranslateModule,
    DashBoardRoutingModule,
    ProfileAccountsCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
  ],
})
export class DashBoardModule {}
