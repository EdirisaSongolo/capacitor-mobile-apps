import { ProfileDTO, ResourceReferenceDTO } from '@app-core/app-api';
import { ComponentAction } from '@domain-data-models/app-domain.enums';

export const APP_DOMAIN = 'App-Domain';

export interface AppDomainStore {
  profileDTO: ProfileDTO;
  componentAction: ComponentAction;
  componentResource: ResourceReferenceDTO;
}
