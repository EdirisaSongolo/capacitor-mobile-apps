import { createReducer, on } from '@ngrx/store';
import { AppDomainStore } from './constants';
import {
  setComponentAction,
  setComponentResource,
  setProfileDTO,
} from './domain.actions';

const AppDomain: AppDomainStore = {
  profileDTO: null,
  componentAction: null,
  componentResource: null,
};

export const appDomainReducer = createReducer(
  AppDomain,
  on(setProfileDTO, (state, { profileDTO }) => ({
    ...state,
    profileDTO: { ...profileDTO },
  })),
  on(setComponentAction, (state, { componentAction }) => ({
    ...state,
    componentAction: componentAction,
  })),
  on(setComponentResource, (state, { componentResource }) => ({
    ...state,
    componentResource: { ...componentResource },
  }))
);
