import { ApiProperty } from '@nestjs/swagger';

export class PdfDto {
  @ApiProperty({ default: 'Hasibul Islam' })
  fullName: string;
  @ApiProperty({ default: '01756' })
  phone: string;
  @ApiProperty({ default: 'hasibul.dev506@gmail.com' })
  email: string;
  @ApiProperty({ default: '1234' })
  password: string;
}
