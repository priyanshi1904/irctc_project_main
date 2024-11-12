import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async bookSeat(userId: number, trainId: number, seatCount: number) {
    // Use a transaction to handle race conditions
    return this.prisma
      .$transaction(async (tx) => {
        // Get train with a lock for update
        const train = await tx.train.findUnique({
          where: { id: trainId },
          select: { seats: true },
        });

        if (!train) {
          throw new ConflictException('Train not found');
        }

        // Check if enough seats are available
        if (train.seats < seatCount) {
          throw new ConflictException('Not enough seats available');
        }

        // Create booking and update seats atomically
        const [booking] = await Promise.all([
          tx.booking.create({
            data: {
              userId,
              trainId,
              seatCount,
            },
          }),
          tx.train.update({
            where: { id: trainId },
            data: {
              seats: train.seats - seatCount,
            },
          }),
        ]);

        return booking;
      })
      .catch((error) => {
        if (error instanceof Error) {
          throw new ConflictException(error.message);
        }
        throw new ConflictException('Not enough seats available');
      });
  }

  async getBookingDetails(bookingId: string, userId: number) {
    return this.prisma.booking
      .findFirst({
        where: {
          id: parseInt(bookingId),
          userId: userId,
        },
        include: {
          train: true,
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
