import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
