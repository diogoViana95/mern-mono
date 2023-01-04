import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import { Req } from '../models';
import { UsersService } from './users.service';

export default function registerServices(app: Express) {
  const prisma = new PrismaClient();
  const usersService = new UsersService(prisma);

  app.use((req: Req, res, next) => {
    req.usersService = usersService;
    next();
  });
}
