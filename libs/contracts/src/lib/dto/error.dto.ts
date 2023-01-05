export type ErrorCode =
  | 'userNotFound'
  | 'unknownError'
  | 'invalidCredentials'
  | 'userAlreadyExists';

export type ErrorResponse = {
  code: ErrorCode;
  status: number;
  message: string;
};
