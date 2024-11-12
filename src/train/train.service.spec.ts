import { Test, TestingModule } from '@nestjs/testing';
import { TrainService } from './train.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('TrainService', () => {
  let service: TrainService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    train: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TrainService>(TrainService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('addTrain', () => {
    it('should create a new train successfully', async () => {
      const mockTrain = {
        id: 1,
        name: 'Express Train',
        description: 'Fast train',
        seats: 100,
        source: 'City A',
        destination: 'City B',
      };

      mockPrismaService.train.create.mockResolvedValue(mockTrain);

      const result = await service.addTrain(
        'Express Train',
        'Fast train',
        100,
        'City A',
        'City B',
      );

      expect(result).toEqual(mockTrain);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.train.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.addTrain(
          'Express Train',
          'Fast train',
          100,
          'City A',
          'City B',
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
