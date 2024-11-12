import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { TrainModule } from './train/train.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    BookingModule,
    TrainModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, JwtService],
})
export class AppModule {}
