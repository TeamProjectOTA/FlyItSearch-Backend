import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('sign-in-admin')
  signIn(@Body() signIndto: Authdto) {
    return this.authservice.signInAdmin(signIndto.uuid, signIndto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in-user')
  signInUser(@Body() signIndto: Userauthdto) {
    return this.authservice.signInUser(signIndto.email, signIndto.password);
  }
  
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    const user = await this.authservice.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.emailVerified = true;
    user.verificationToken = null;  // Remove the token after verification
    await this.userRepository.update(user.id, user);

    return { message: 'Email verified successfully' };
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string): Promise<void> {
  //   await this.authservice.sendPasswordResetEmail(email);
  // }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body('token') token: string,
  //   @Body('newPassword') newPassword: string,
  // ): Promise<void> {
  //   await this.authservice.resetPassword(token, newPassword);
  // }
}
