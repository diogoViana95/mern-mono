import {
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  TokenResponse,
} from '@mern-mono/contracts';
import { Express, RequestHandler } from 'express';
import * as z from 'zod';
import { generateValidationSchema, validate } from '../handlers';
import { Req } from '../models';

const loginSchema = generateValidationSchema<LoginRequest>({
  body: {
    email: z.string().email(),
    password: z.string(),
  },
});

const login: RequestHandler = async (req: Req, res) => {
  const token = await req.authService.login(req.body.email, req.body.password);
  const result: TokenResponse = {
    token: token.token,
    tokenDuration: token.tokenDuration,
    refreshToken: token.refreshToken,
    refreshTokenDuration: token.refreshTokenDuration,
  };
  res.status(201).json(result);
};

const registerSchema = generateValidationSchema<RegisterRequest>({
  body: {
    email: z.string().email(),
    password: z.string(),
    name: z.string().optional(),
  },
});

const register: RequestHandler = async (req: Req, res) => {
  const token = await req.authService.register(
    req.body.email,
    req.body.password,
    req.body.name
  );

  const result: TokenResponse = {
    token: token.token,
    tokenDuration: token.tokenDuration,
    refreshToken: token.refreshToken,
    refreshTokenDuration: token.refreshTokenDuration,
  };

  res.status(201).json(result);
};

const refreshTokenSchema = generateValidationSchema<RefreshTokenRequest>({
  body: {
    token: z.string(),
  },
});
const refreshToken: RequestHandler = async (req: Req, res) => {
  const token = await req.authService.refreshToken(req.body.token);
  const result: RefreshTokenResponse = {
    token: token.token,
    tokenDuration: token.tokenDuration,
  };
  res.status(201).json(result);
};

export default function registerAuthController(app: Express): void {
  app.post('/api/v1/auth/login', validate(loginSchema), login);
  app.post('/api/v1/auth/register', validate(registerSchema), register);
  app.post('/api/v1/auth/refresh', validate(refreshTokenSchema), refreshToken);
}
