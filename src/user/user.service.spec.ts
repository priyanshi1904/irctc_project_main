import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long!!';
  });

  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('login', () => {
    it('should throw BadRequestException for invalid email format', async () => {
      await expect(
        service.login({ email: 'invalid-email', password: 'password123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return JWT token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: service['encrypt']('test@test.com'),
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
    });
  });

  describe('register', () => {
    it('should throw BadRequestException for invalid input', async () => {
      await expect(
        service.register({
          name: '',
          email: 'invalid-email',
          password: 'short',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when email already exists', async () => {
      mockPrismaService.user.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create new user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'encrypted-email',
        password: 'hashed-password',
        role: 'USER',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
    });
  });
});
