export type ErrorCode =
  | 'userNotFound'
  | 'unknownError'
  | 'invalidCredentials'
  | 'userAlreadyExists'
  | 'tokenNotFound';

export type ErrorResponse = {
  code: ErrorCode;
  status: number;
  message: string;
};
