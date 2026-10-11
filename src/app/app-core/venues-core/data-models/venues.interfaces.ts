import {
  DashboardDisplayPanel,
  ProfileDisplayPanel,
} from '@venues-core/data-models/venues.enums';
import { VenuesDashboardRoutes } from '@venues-core/data-models/venues-dashboard.routes';
import { VenuesRoutes } from './venues.routes';

export interface DashboardDisplay {
  display: DashboardDisplayPanel;
  name: string;
  icon: string;
  route: VenuesDashboardRoutes;
}

export interface ProfileDisplay {
  display: ProfileDisplayPanel;
  name: string;
  icon: string;
  route: VenuesRoutes;
}
