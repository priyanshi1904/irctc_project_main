import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainService {
  constructor(private prisma: PrismaService) {}

  async addTrain(
    name: string,
    description: string,
    seats: number,
    source: string,
    destination: string,
  ) {
    return this.prisma.train
      .create({
        data: {
          name,
          description,
          source,
          destination,
          seats,
        },
      })
      .catch((error) => {
        if (error instanceof Error) {
          throw new InternalServerErrorException(error.message);
        }

        throw new InternalServerErrorException('Unknown Error: ', error);
      });
  }

  async getAvailability(trainId: number) {
    return this.prisma.train
      .findUnique({
        where: {
          id: trainId,
        },
      })
      .catch((error) => {
        if (error instanceof Error) {
          throw new InternalServerErrorException(error.message);
        }

        throw new InternalServerErrorException('Unknown Error: ', error);
      });
  }
}
