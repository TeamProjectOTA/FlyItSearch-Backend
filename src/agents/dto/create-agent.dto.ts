import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ default: 'Test agent' })
  name: string;
  @IsEmail()
  @ApiProperty({default:'test@gmail.com'})
  email: string;
  @ApiProperty({default:"testCompany"})
  company: string;
  @ApiProperty({default:'014531646'})
  phone: string;
  @ApiProperty({default:'S jakuma'})
  address: string;
@ApiProperty({default:'1234'})
  password: string;
  @IsIn(['active', 'inactive'])
  @ApiProperty({default:'active'})
  status: string;
  @ApiProperty({default:'jdha'})
  logo: string;
  @ApiProperty({default:1200})
  credit: number;
  @ApiProperty({default:'free'})
  markuptype: string;
 @ApiProperty({default:10})
  markup: number;
  @ApiProperty({default:'free'})
  clientmarkuptype: string;
  @ApiProperty({default:10})
  clientmarkup: number;
}
