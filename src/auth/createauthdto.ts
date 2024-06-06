import { IsEmail, IsString } from 'class-validator';

export class Authdto {
  @IsString()
  adminid: string;
  password: string;
}
export class Userauthdto {
  @IsEmail()
  email: string;
  password: string;
}
