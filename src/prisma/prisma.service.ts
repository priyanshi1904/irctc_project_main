import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error(error);
      console.log('Database connection failed');
      throw new InternalServerErrorException('Database connection failed');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
