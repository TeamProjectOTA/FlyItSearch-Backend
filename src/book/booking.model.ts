import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookingSave {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  system: string;
  @Column()
  bookingId: string;
  @Column()
  paxCount: number;
  @Column()
  Curriername: string;
  @Column()
  CurrierCode: string;
  @Column()
  flightNumber: string;
  @Column()
  isRefundable: boolean;
  @Column({ nullable: true })
  bookingDate: string;
  @Column()
  expireDate: Date;
  @Column()
  bookingStatus: string;
  @Column()
  TripType: string;
  @Column()
  PNR: string;
  @Column()
  grossAmmount: string;
  @Column()
  netAmmount: string;
  @Column({ nullable: true })
  actionAt: string;
  @Column({ nullable: true })
  actionBy: String;
  @Column({ nullable: true })
  reason: string;
  @Column('json', { nullable: true })
  laginfo: any; // Store laginfo as a JSON object
  @Column('json', { nullable: true })
  personId: { index?: number; visa?: string; passport?: string }[];
  @Column('json', { nullable: true })
  bookingData: any;
  @ManyToOne(() => User, (user) => user.bookingSave, { onDelete: 'CASCADE' })
  user: User;
}

class CreateLagInfoDto {
  @IsString()
  DepDate?: string;

  @IsString()
  DepFrom?: string;

  @IsString()
  ArrTo?: string;
}

export class CreateSaveBookingDto {
  @IsString()
  system: string;
  @IsString()
  bookingId: string;

  @IsNumber()
  paxCount: number;

  @IsString()
  Curriername: string;

  @IsString()
  CurrierCode: string;

  @IsString()
  flightNumber: string;

  @IsBoolean()
  isRefundable: boolean;

  @IsString()
  bookingDate: string;

  @IsString()
  expireDate: Date;

  @IsString()
  bookingStatus: string;

  @IsString()
  TripType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLagInfoDto)
  laginfo: CreateLagInfoDto[];
}
export class BookingID {
  @ApiProperty({ default: '22' })
  @IsNotEmpty()
  @IsString()
  BookingID: string;
}

export class PassengerDto {
  @ApiProperty()
  @IsString()
  Title: string;

  @ApiProperty()
  @IsString()
  FirstName: string;

  @ApiProperty()
  @IsString()
  LastName: string;

  @ApiProperty()
  @IsString()
  PaxType: string;
  @ApiProperty()
  @IsString()
  DateOfBirth: string;
  @ApiProperty()
  @IsString()
  Gender: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  PassportNumber?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  PassportExpiryDate?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  PassportNationality?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  passport?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  visa?: string;
  @ApiProperty()
  @IsString()
  CountryCode: string;
  @ApiProperty()
  @IsString()
  Nationality: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  FFAirline?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  FFNumber?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  SSRType?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  SSRRemarks?: string;
  @ApiProperty()
  @IsString()
  ContactNumber: string;
  @ApiProperty()
  @IsString()
  Email: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  Address1?: string;
  @ApiProperty()
  @IsBoolean()
  IsLeadPassenger: boolean;
}

export class BookingDataDto {
  @ApiProperty()
  @IsString()
  SearchId: string;
  @ApiProperty()
  @IsString({ each: true })
  ResultId: string;

  @IsArray()
  @ApiProperty({ type: [PassengerDto] })
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  Passengers: PassengerDto[];
}
