import { Express, RequestHandler } from 'express';
import { Req } from '../models';

import * as z from 'zod';
import { generateValidationSchema, validate } from '../handlers';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from '@mern-mono/contracts';

const loginSchema = generateValidationSchema<LoginRequest>({
  body: {
    email: z.string().email(),
    password: z.string(),
  },
});

const login: RequestHandler = async (req: Req, res) => {
  const token = await req.authService.login(req.body.email, req.body.password);
  const result: TokenResponse = {
    refreshToken: token.refreshToken,
    token: token.token,
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
    refreshToken: token.refreshToken,
    token: token.token,
  };

  res.status(201).json(result);
};

export default function registerAuthController(app: Express): void {
  app.post('/api/v1/auth/login', validate(loginSchema), login);
  app.post('/api/v1/auth/register', validate(registerSchema), register);
}
