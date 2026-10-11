import {
  AccountDisplayPanel,
  DashboardDisplayPanel,
  ProfileDisplayPanel,
  SocialsAction,
} from '@user-profile-core/data-models/user-profile.enums';
import { UserProfileDashboardRoutes } from '@user-profile-core/data-models/user-profile-dashboard.routes';
import { UserProfileRoutes } from '@user-profile-core/data-models/user-profile.routes';

export interface DashboardDisplay {
  display: DashboardDisplayPanel;
  name?: string;
  icon: string;
  route: UserProfileDashboardRoutes;
}

export interface ProfileDisplay {
  display: ProfileDisplayPanel;
  name: string;
  icon: string;
  route: UserProfileRoutes;
}

export interface AccountDisplay {
  display: AccountDisplayPanel;
  name: string;
  icon: string;
  route: string;
}

export interface UserSocialsAction {
  userName: string;
  socialsAction: SocialsAction;
}
