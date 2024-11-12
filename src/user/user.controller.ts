import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  register(@Body() body: { name: string; email: string; password: string }) {
    return this.userService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body);
  }
}
