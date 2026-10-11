import { ActionReducer, MetaReducer } from '@ngrx/store';
import { logout } from '@app-store/app.actions';
import { USER_LOCATION } from '@app-store/app.selectors';

export const clearStateOnLogout: MetaReducer =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) =>
    reducer(
      action.type === logout.type
        ? { [USER_LOCATION]: state?.[USER_LOCATION] }
        : state,
      action
    );
