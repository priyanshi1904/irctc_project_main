import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    train: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('bookSeat', () => {
    it('should throw ConflictException when not enough seats available', async () => {
      mockPrismaService.train.findUnique.mockResolvedValue({
        id: 1,
        seats: 5,
      });

      await expect(service.bookSeat(1, 1, 10)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should book seats successfully', async () => {
      const mockBooking = {
        id: 1,
        userId: 1,
        trainId: 1,
        seatCount: 2,
      };

      mockPrismaService.train.findUnique.mockResolvedValue({
        id: 1,
        seats: 10,
      });
      mockPrismaService.booking.create.mockResolvedValue(mockBooking);

      const result = await service.bookSeat(1, 1, 2);

      expect(result).toEqual(mockBooking);
      expect(mockPrismaService.train.update).toHaveBeenCalled();
    });
  });
});
