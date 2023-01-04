import { User } from '@prisma/client';
import { Service } from './service';

export class UsersService extends Service {
  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
