import { AuthToken, PrismaClient, User } from '@prisma/client';
import { ApiError } from '../models';
import { Service } from './service';
import { UsersService } from './users.service';

export class AuthService extends Service {
  constructor(
    prisma: PrismaClient,
    private readonly userService: UsersService
  ) {
    super(prisma);
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError('invalidCredentials');
    }
    if (user.password !== password) {
      throw new ApiError('invalidCredentials');
    }
    return this.generateToken(user);
  }

  async register(email: string, password: string, name?: string) {
    const newUser = await this.userService.createUser({
      email,
      password,
      name,
    });
    return this.generateToken(newUser);
  }

  private generateToken(user: User): Promise<AuthToken> {
    return this.prisma.authToken.create({
      data: {
        token: user.id,
        refreshToken: user.id,
        userId: user.id,
      },
    });
  }
}
