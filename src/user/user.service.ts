import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IsEmail, IsString, Length, validateOrReject } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

class RegisterDto extends LoginDto {
  @IsString()
  name: string;
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(body: { email: string; password: string }) {
    const loginDto = new LoginDto();
    loginDto.email = body.email;
    loginDto.password = body.password;

    try {
      await validateOrReject(loginDto);
    } catch (errors) {
      throw new BadRequestException('Validation failed');
    }

    const encryptedEmail = this.encrypt(body.email);

    const user = await this.prisma.user.findFirst({
      where: {
        email: encryptedEmail,
        password: body.password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatching = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(body: { name: string; email: string; password: string }) {
    const role = 'USER';

    const registerDto = new RegisterDto();
    registerDto.email = body.email;
    registerDto.password = body.password;
    registerDto.name = body.name;

    try {
      await validateOrReject(registerDto);
    } catch (errors) {
      throw new BadRequestException('Validation failed');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    // const apiKey = body.role === 'ADMIN' ? this.generateApiKey() : null;

    const encryptedEmail = this.encrypt(body.email);

    return this.prisma.user
      .create({
        data: {
          ...body,
          email: encryptedEmail,
          password: hashedPassword,
          role: 'USER',
          // apiKey,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
        if (error instanceof Error) {
          throw new ConflictException(error.message);
        }
        throw new InternalServerErrorException(error);
      });
  }

  // private generateApiKey(): string {
  //   return crypto.randomUUID();
  // }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
