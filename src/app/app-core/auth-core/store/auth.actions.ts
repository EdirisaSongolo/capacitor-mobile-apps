import { createAction, props } from '@ngrx/store';
import {
  SignUp,
  LogIn,
  EmailDTO,
  PasswordResetDTO,
} from '@app-core/auth-core/api/auth.dto-models';

export const REGISTER_USER_PROFILE: string = '[Auth] Register user profile';
export const registerUserProfile = createAction(
  REGISTER_USER_PROFILE,
  props<{ signUp: SignUp }>()
);

export const AUTHENTICATE_USER: string = '[Auth] Authenticate user credentials';
export const authenticateUserProfile = createAction(
  AUTHENTICATE_USER,
  props<{ logIn: LogIn }>()
);

export const CREATE_TEMP_PASSWORD: string =
  '[Auth] Create user temporary password';
export const createUserTemporaryPassword = createAction(
  CREATE_TEMP_PASSWORD,
  props<{ userEmail: EmailDTO }>()
);

export const RESET_USER_PASSWORD: string = '[Auth] Reset user password';
export const resetUserPassword = createAction(
  RESET_USER_PASSWORD,
  props<{ passwordReset: PasswordResetDTO }>()
);
