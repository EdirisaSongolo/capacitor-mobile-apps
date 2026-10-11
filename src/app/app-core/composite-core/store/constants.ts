import { ProfileTokenDTO } from '@app-core/app-api';
import { SearchRecord } from '@composite-core/api/composite.dto-models';

export const COMPOSITE: string = 'Composite';

export interface CompositeStore {
  searchRecords: SearchRecord[];
  searchResults: ProfileTokenDTO[];
}
