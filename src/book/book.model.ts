import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
@Entity()
export class SaveBooking {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  system:string;

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

  @Column()
  bookingDate: Date;

  @Column()
  expireDate: Date;

  @Column()
  bookingStatus: string;

  @Column()
  TripType: string;

  @OneToMany(() => LagInfo, (lagInfo) => lagInfo.saveBooking, { cascade: true })
  laginfo: LagInfo[];
  @ManyToOne(() => User, (user) => user.saveBookings)
  user: User;
}
@Entity()
export class LagInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  DepDate: string;

  @Column()
  DepFrom: string;

  @Column()
  ArrTo: string;

  @ManyToOne(() => SaveBooking, (saveBooking) => saveBooking.laginfo)
  saveBooking: SaveBooking;
}

export class BookingID {
  @ApiProperty({ default: '22' })
  @IsNotEmpty()
  @IsString()
  BookingID: string;
}
class CreateLagInfoDto {
  @IsString()
  DepDate: string;

  @IsString()
  DepFrom: string;

  @IsString()
  ArrTo: string;
}

export class CreateSaveBookingDto {
  @IsString()
  system:string
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
 
  expireDate: string;

  @IsString()
  bookingStatus: string;

  @IsString()
  TripType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLagInfoDto)
  laginfo: CreateLagInfoDto[];
}