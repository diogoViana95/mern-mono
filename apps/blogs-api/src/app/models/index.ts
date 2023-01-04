import { Request } from 'express';
import { UsersService } from '../services/users.service';
export type Req = Request & {
  usersService: UsersService;
};
