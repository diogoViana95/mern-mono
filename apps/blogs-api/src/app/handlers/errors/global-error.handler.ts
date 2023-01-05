import { ErrorResponse } from '@mern-mono/contracts';
import { ErrorRequestHandler, NextFunction, Response } from 'express';
import { ApiError, Req } from '../../models';
import * as errors from './errors.json';

export const globalErrorHandler: ErrorRequestHandler = (
  error: ApiError,
  req: Req,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const response: ErrorResponse =
    errors[error.code ?? ''] ?? errors.unknownError;

  res.status(response.status).json(response);
};
