import { ErrorCode } from '@mern-mono/contracts';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
export type Req = Request & {
  usersService: UsersService;
  authService: AuthService;
};

export class ApiError {
  constructor(readonly code: ErrorCode) {}
}
