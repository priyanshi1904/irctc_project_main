import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { TrainService } from './train.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  addTrain(
    @GetUser() user: { userId: number; username: string; role: string },
    @Body()
    body: {
      name: string;
      description: string;
      seats: number;
      source: string;
      destination: string;
    },
  ) {
    // validate userId and role
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('You are not authorized to add train');
    }

    return this.trainService.addTrain(
      body.name,
      body.description,
      body.seats,
      body.source,
      body.destination,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('availability')
  getAvailability(
    @GetUser() user: { userId: number; username: string; role: string },
    @Body() body: { trainId: number },
  ) {
    // validate userId and role
    if (user.role !== 'USER') {
      throw new UnauthorizedException(
        'You are not authorized to get availability',
      );
    }
    return this.trainService.getAvailability(body.trainId);
  }
}
