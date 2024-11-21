import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOuthService } from './google-outh.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
@ApiTags('Google-log-in')
@Controller('social-site')
export class GoogleOuthController {
  constructor(
    private readonly appService: GoogleOuthService,
    private authService: AuthService,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('User from Google:', req.user);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    return res.status(200).json({
      user,
    });
  }

  @Post('fireabaseGoogle')
  async validateUser(
    @Body() user: { email: string; fullName: string; googleId: string },
  ) {
    const validatedUser = await this.authService.validateUser(user);
    return validatedUser;
  }
}
