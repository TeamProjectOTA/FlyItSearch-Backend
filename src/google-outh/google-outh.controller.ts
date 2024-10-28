import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOuthService } from './google-outh.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

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
  async googleAuthRedirect(@Req() req) {
    return req.user;
  }

 
}
