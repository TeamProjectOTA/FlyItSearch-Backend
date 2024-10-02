import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
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
export class data {
  data: any;
}
