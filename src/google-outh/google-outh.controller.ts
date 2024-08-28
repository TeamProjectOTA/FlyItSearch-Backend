import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOuthService } from './google-outh.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Google-log-in')
@Controller('social-site')
export class GoogleOuthController {
  constructor(private readonly appService: GoogleOuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('/googleRedirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return this.appService.googleLogin(req);
  }
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: any) {}

  @Get('/facebookRedirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: any) {
    return this.appService.facebookLogin(req);
  }
}
