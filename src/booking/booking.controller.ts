import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('booking')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('book')
  bookSeat(
    @GetUser() user: { userId: number; username: string; role: string },
    @Body() body: { trainId: number; seatCount: number },
  ) {
    return this.bookingService.bookSeat(
      user.userId,
      body.trainId,
      body.seatCount,
    );
  }

  @Get('details/:bookingId')
  getBookingDetails(
    @GetUser() user: { userId: number; username: string; role: string },
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.getBookingDetails(bookingId, user.userId);
  }
}
