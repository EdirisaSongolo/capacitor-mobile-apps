import {
  CreatePrivateEventPanel,
  DashboardDisplayPanel,
  ProfileDisplayPanel,
} from '@private-events-core/data-models';
import { EventTypes } from '@domain-data-models/app-domain.enums';

export interface DisplayPanelData {
  displayPanel: CreatePrivateEventPanel;
  panelData: any;
}

export interface CreateEventControl {
  index: number;
  event: EventTypes;
  name: string;
  icon: string;
  displayPanel: CreatePrivateEventPanel;
  completed: boolean;
}

export interface DashboardDisplay {
  display: DashboardDisplayPanel;
  route: string;
  icon: string;
}

export interface ProfileDisplayControl {
  display: ProfileDisplayPanel;
  name: string;
  icon: string;
}
