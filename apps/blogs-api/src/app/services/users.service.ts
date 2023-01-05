import { Prisma, User } from '@prisma/client';
import { ApiError } from '../models';
import { Service } from './service';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export class UsersService extends Service {
  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  getUserById(id: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.getUserByEmail(data.email);

    data.password = await bcrypt.hash(data.password, saltRounds);

    if (user) {
      throw new ApiError('userAlreadyExists');
    }
    return this.prisma.user.create({
      data,
    });
  }

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new ApiError('invalidCredentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ApiError('invalidCredentials');
    }
    return user;
  }
}
