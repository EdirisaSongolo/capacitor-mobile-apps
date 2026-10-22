import {
  CreatePublicEventPanel,
  DashboardDisplayPanel,
  ProfileDisplayPanel,
  UserPublicEventRoutes,
} from '@public-events-core/data-models';

import {
  CreatePublicEvent,
  PublicEventTokenDTO,
} from '@public-events-core/api';

import { EventTypes } from '@domain-data-models/app-domain.enums';

export interface CreateEventControl {
  index: number;
  event: EventTypes;
  name: string;
  icon?: string;
  displayPanel: CreatePublicEventPanel;
  completed: boolean;
}

export interface CreateEvent {
  control: CreateEventControl;
  displayPanel: CreatePublicEventPanel;
  createEventProfile: CreatePublicEvent;
}

export interface CategoryPublicEvents {
  category: string;
  name: string;
  route: string;
  publicEvents?: PublicEventTokenDTO[];
}

export interface ProfileDisplayControl {
  display: ProfileDisplayPanel;
  name: string;
  icon: string;
  route: string;
}

export interface DashboardDisplay {
  display: DashboardDisplayPanel;
  route: string;
  icon: string;
}

export interface UserPublicEventDisplay {
  name: string;
  icon: string;
  route: UserPublicEventRoutes;
}
