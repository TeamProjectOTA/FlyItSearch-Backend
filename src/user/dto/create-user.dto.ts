import { ApiProperty } from '@nestjs/swagger';
import {

  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'Hasibul Islam' })
  fullName: string;
  @ApiProperty({ default: '01756' })
  phone: string;
  @ApiProperty({ default: 'hasibul.dev506@gmail.com' })
  email: string;
  // @MaxLength(15)
  // @MinLength(6)
  @ApiProperty({ default: '1234' })
  password: string;
  @ApiProperty({ default: '1-2-1998' })
  dob?: string;
  @ApiProperty({ default: 'Male' })
  gender?: string;
  @ApiProperty({ default: 'Bangladeshi' })
  nationility?: string;
  @ApiProperty({ default: 'Q14596723' })
  passport?: string;
  @ApiProperty()
  passportexp?: string;
}
