import { PrismaClient } from '@prisma/client';

export class Service {
  constructor(protected readonly prisma: PrismaClient) {}
}
