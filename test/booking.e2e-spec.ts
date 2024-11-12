import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Booking (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  it('/booking/book (POST) - should require authentication', () => {
    return request(app.getHttpServer())
      .post('/booking/book')
      .send({ trainId: 1, seatCount: 1 })
      .expect(401);
  });

  it('/booking/book (POST) - should book seats with valid token', async () => {
    const token = jwtService.sign({
      sub: 1,
      username: 'test@test.com',
      role: 'USER',
    });

    return request(app.getHttpServer())
      .post('/booking/book')
      .set('Authorization', `Bearer ${token}`)
      .send({ trainId: 1, seatCount: 1 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
