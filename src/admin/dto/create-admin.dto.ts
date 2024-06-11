import { ApiProperty } from '@nestjs/swagger';

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export class CreateAdminDto {
  @ApiProperty({ default: 'Hasibul' })
  firstName: string;
  @ApiProperty({ default: 'Islam' })
  lastName: string;
  @ApiProperty({ default: 'hasibul@gmail.com' })
  email: string;
  @ApiProperty({ default: '0114378661' })
  phone: string;
  @ApiProperty({ default: 'admin' })
  password: string;
  @ApiProperty({ default: 'superAdmin' })
  role: string;
  @ApiProperty({ default: 'ACTIVE' })
  status: Status;
}
