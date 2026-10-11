import { ProfileDTO, ResourceReferenceDTO } from '@app-core/app-api';
import { ComponentAction } from '@domain-data-models/app-domain.enums';
import { createAction, props } from '@ngrx/store';

export const SET_PROFILE_DTO = '[App Domain] Set profile DTO';
export const setProfileDTO = createAction(
  SET_PROFILE_DTO,
  props<{ profileDTO: ProfileDTO }>()
);

export const SET_COMPONENT_ACTION = '[App Domain] Set component action';
export const setComponentAction = createAction(
  SET_COMPONENT_ACTION,
  props<{ componentAction: ComponentAction }>()
);

export const SET_COMPONENT_RESOURCE = '[App Domain] Set Component Resource';
export const setComponentResource = createAction(
  SET_COMPONENT_RESOURCE,
  props<{ componentResource: ResourceReferenceDTO }>()
);
