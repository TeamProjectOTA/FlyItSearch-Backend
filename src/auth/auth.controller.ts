import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
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
}
