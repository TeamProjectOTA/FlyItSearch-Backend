import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum JourneyType {
  Economy = 1,
  Premium_Economy = 2,
  Business = 3,
  First = 4,
}
class SegmentDto {
  @ApiProperty({ default: 'DAC' })
  @IsString()
  @Length(3, 3)
  depfrom: string;

  @ApiProperty({ default: 'DXB' })
  @IsString()
  @Length(3, 3)
  arrto: string;

  @ApiProperty({ default: '2024-07-01' })
  @IsDate()
  depdate: Date;
}

export class FlightSearchModel {
  @ApiProperty({ default: 1 })
  @IsPositive()
  @IsInt()
  adultcount: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  childcount: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  infantcount: number;

  @ApiProperty({ default: '1' })
  @IsString()
  @Length(1, 1)
  cabinclass: string;

  @ApiProperty({ type: [SegmentDto] })
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  segments: SegmentDto[];
}
@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  AdultQuantity: number;

  @Column()
  ChildQuantity: number;

  @Column()
  InfantQuantity: number;

  @Column()
  EndUserIp: string;

  @Column()
  JourneyType: number;

  @OneToMany(() => Segment, (segment) => segment.flight, { cascade: true })
  Segments: Segment[];
}

@Entity()
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Origin: string;

  @Column()
  Destination: string;

  @Column()
  CabinClass: string;

  @Column()
  DepartureDateTime: string;

  @ManyToOne(() => Flight, (flight) => flight.Segments)
  flight: Flight;
}
