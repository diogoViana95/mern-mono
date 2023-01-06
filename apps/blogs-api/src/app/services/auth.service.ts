/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthToken, PrismaClient, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { ApiError } from '../models';
import { Service } from './service';
import { UsersService } from './users.service';

function convertStringToMillis(value: string): number {
  // convert to milliseconds from string like 1s, 1m, 1h, 1d, 1M, 1y
  const reg = /(\d+)([smhdMy])/;
  const match = reg.exec(value);
  if (match) {
    const [, number, unit] = match;
    const multiplier = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      M: 30 * 24 * 60 * 60 * 1000,
      y: 365 * 24 * 60 * 60 * 1000,
    }[unit];
    return Number(number) * multiplier;
  }
  return 0;
}

export class AuthService extends Service {
  private readonly tokenSecret = process.env.TOKEN_SECRET;
  private readonly tokenDuration = convertStringToMillis(
    process.env.TOKEN_DURATION
  );
  private readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  private readonly refreshTokenDuration = convertStringToMillis(
    process.env.REFRESH_TOKEN_DURATION
  );

  constructor(
    prisma: PrismaClient,
    private readonly userService: UsersService
  ) {
    super(prisma);
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const user = await this.userService.authenticate(email, password);
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

  private async generateToken(user: User): Promise<AuthToken> {
    return this.prisma.authToken.create({
      data: {
        token: await this.generateTokenValue(
          user.id,
          this.tokenSecret,
          this.tokenDuration
        ),
        tokenDuration: this.tokenDuration,
        refreshToken: await this.generateTokenValue(
          user.id,
          this.refreshTokenSecret,
          this.refreshTokenDuration
        ),
        refreshTokenDuration: this.refreshTokenDuration,
        userId: user.id,
      },
    });
  }

  async refreshToken(token: string): Promise<AuthToken> {
    const authtoken = await this.prisma.authToken.findUnique({
      where: { refreshToken: token },
    });
    if (!authtoken) {
      throw new ApiError('tokenNotFound');
    }
    try {
      await this.verifyToken(token, this.refreshTokenSecret);
    } catch (err) {
      await this.prisma.authToken.delete({ where: { id: authtoken.id } });
      throw new ApiError('tokenNotFound');
    }

    const newToken = await this.generateTokenValue(
      authtoken.userId,
      this.tokenSecret,
      this.tokenDuration
    );
    return this.prisma.authToken.update({
      where: { id: authtoken.id },
      data: {
        token: newToken,
      },
    });
  }

  private async verifyToken(token: string, secret: string): Promise<void> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  private generateTokenValue(
    id: string,
    secret: string,
    duration: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign({ id }, secret, { expiresIn: duration }, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }
}
