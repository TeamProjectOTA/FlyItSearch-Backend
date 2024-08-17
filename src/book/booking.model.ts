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
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SaveBooking {
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

  @Column({nullable:true})
  bookingDate: string;

  @Column()
  expireDate: Date;

  @Column()
  bookingStatus: string;

  @Column()
  TripType: string;

  @OneToMany(() => LagInfo, (lagInfo) => lagInfo.saveBooking, {
    onDelete: 'CASCADE',
  })
  laginfo: LagInfo[];
  @ManyToOne(() => User, (user) => user.saveBookings, { onDelete: 'CASCADE' })
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

  @ManyToOne(() => SaveBooking, (saveBooking) => saveBooking.laginfo, {
    onDelete: 'CASCADE',
  })
  saveBooking: SaveBooking;
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
