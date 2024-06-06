import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GoogleOuthService {
  googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  facebookLogin(req: any) {
    if (!req.user) {
      return 'No user from facebook';
    }

    return {
      message: 'User information from facebook',
      user: req.user,
    };
  }
  // async verifytoken(header:any){
  // const token = header['authorization'].replace('Bearer','')
  // if (!token){
  //   throw new UnauthorizedException()
  // }

  // }
}
