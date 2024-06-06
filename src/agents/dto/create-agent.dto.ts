import { IsEmail, IsIn } from 'class-validator';

export class CreateAgentDto {
  name: string;
  @IsEmail()
  email: string;
  company: string;
  phone: string;
  address: string;
  password: string;
  @IsIn(['active', 'inactive'])
  status: string;
  logo: string;
  credit: number;
  markuptype: string;
  markup: number;
  clientmarkuptype: string;
  clientmarkup: number;
}
