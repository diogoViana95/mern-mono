import { Express } from 'express';
import registerAuthController from './auth.controller';

export function registerControllers(app: Express): void {
  registerAuthController(app);
}
