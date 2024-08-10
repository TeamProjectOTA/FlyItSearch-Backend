import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'Hasibul Islam' })
  fullName: string;
  @ApiProperty({ default: '01756' })
  phone: string;
  @ApiProperty({ default: 'hasibul.dev506@gmail.com' })
  email: string;
  @ApiProperty({ default: '1234' })
  password: string;
  @ApiProperty()
  dob?:string
  @ApiProperty()
  gender?:string
  @ApiProperty()
  nationility?:string
  @ApiProperty()
  passport?:string
}
