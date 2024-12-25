import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('signInAdmin')
  signIn(@Body() signIndto: Authdto) {
    return this.authservice.signInAdmin(signIndto.email, signIndto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signInUser')
  signInUser(@Body() signIndto: Userauthdto) {
    return this.authservice.signInUser(signIndto.email, signIndto.password);
  }

  @Get('verifyEmail')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    const user = await this.authservice.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await this.userRepository.update(user.id, user);
    await this.authservice.emailVerified(user.email);

    return { message: 'Email verified successfully' };
  }

  @Post('forgotPassword')
  async forgotPassword(@Body('email') email: string): Promise<any> {
    return await this.authservice.sendPasswordResetEmail(email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    return await this.authservice.resetPassword(token, newPassword);
  }

  @Get('google/:token')
  async authenticateWithGoogle(@Param('token') token: string) {
    try {
      const user = await this.authservice.verifyGoogleToken(token);
      return user
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
