import { Express, RequestHandler } from 'express';
import { Req } from '../models';

const register: RequestHandler = (req: Req, res, next) => {
  res.end();
};

export default function registerAuthController(app: Express): void {
  app.post('/api/v1/auth/login', register);
}
