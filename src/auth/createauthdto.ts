import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class Authdto {
  @ApiProperty()
  @IsString()
  uuid: string;
  @ApiProperty()
  password: string;
}
export class Userauthdto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
}
