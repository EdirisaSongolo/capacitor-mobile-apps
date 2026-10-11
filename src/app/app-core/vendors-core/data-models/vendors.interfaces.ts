import {
  DashboardDisplayPanel,
  ProfileDisplayPanel,
} from '@vendors-core/data-models/vendors.enums';

import { VendorsDashboardRoutes } from '@vendors-core/data-models/vendors-dashboard.routes';
import { VendorsRoutes } from './vendors.routes';

export interface DashboardDisplay {
  display: DashboardDisplayPanel;
  name?: string;
  icon: string;
  route: VendorsDashboardRoutes;
}

export interface ProfileDisplay {
  display: ProfileDisplayPanel;
  name?: string;
  icon: string;
  route: VendorsRoutes;
}
