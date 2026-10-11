import {
  AppResponseType,
  NavOption,
} from '@app-core/app-domain/domain-data-models/app-domain.enums';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface NavigationControl {
  navOption: NavOption;
  icon: string;
  route: string;
}

export interface UserProfileInfo {
  userProfileId: string;
  userName: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  userBiography: string;
}

export interface AppResponse {
  viewed: boolean | null;
  type: AppResponseType | null;
  messages: string[] | null;
}

export interface LocationCategory {
  name: string;
  value: string;
  selected: boolean;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationDetails {
  street_number?: string;
  street?: string;
  postal_code?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EventDate {
  selected: boolean;
  referenceId?: string;
  startTime?: string;
  endTime?: string;
  eventTime?: string;
  date: string;
}
