import { IsEmail, IsEnum } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Designation {
  Mr = 'Mr',
  MRS = 'MRS',
}
export class ResponseDto {
  code: string;
  message: string;
  response: UserDetails;
}

export class UserDetails {
  @IsEnum(Designation)
  designation: Designation;
  address: string;
  mobileNumber: string;
  department: string;
  avatar: string;
  gender: string;
  passportNumber: string;
  passportExpireDate: string;
  country: string;
  city: string;
  postCode: string;
  passport: string;
  seatPreference: string;
  mealPreference: string;
  nationality: string;
  frequentFlyerNumber: string;
  passportCopy: string;
  visaCopy: string;
  quickPick: boolean;
  titleName: string;
  givenName: string;
  surName: string;
  address1: string;
  dateOfBirth: string;
  age: string;
  username: string;
  email: string;
  referralCode: string;
  otherPassengers: any[];
  ssr: SsrType[];
}
export class Ssr {
  code: string;
  name: string;
}

export class SsrType {
  type: string;
  ssr: Ssr[];
}

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  filename: string;
  @Column({ default: 'DEFAULT_PATH' })
  path: string;
  @Column()
  size: number;
  @Column()
  mimetype: string;
}
