export interface SignUp {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  userPassword: string;
}

export interface LogIn {
  userName: string;
  userPassword: string;
}

export interface AuthDTO {
  accessToken: string;
  refreshToken: string;
}

export interface EmailDTO {
  userEmail: string;
}

export interface PasswordResetDTO {
  temporaryPassword: string;
  userPassword: string;
}
