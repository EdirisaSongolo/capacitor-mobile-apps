import { LocationDTO } from '@app-core/app-api';
import {
  AppResponse,
  UserProfileInfo,
} from '@domain-data-models/app-domain.interfaces';

export interface AppStore {
  authenticationStatus: boolean;
  userProfileInfo: UserProfileInfo;
  appResponse: AppResponse;
  userLocation: LocationDTO;
}
