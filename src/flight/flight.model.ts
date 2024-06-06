import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
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
export class flightModel {
  @IsIn(['One way', 'Round Way', 'Multi City'])
  journyType: string;
  adultCount: number;
  childerenCount: number;
  infantCount: number;
  @IsArray()
  Segments: SegmentModel[];
  @IsArray()
  @ArrayMaxSize(10)
  cities: CityInfo[];
}
export class SegmentModel {
  Origin: string;
  Destination: string;
  @IsEnum(JourneyType)
  CabinClass: JourneyType;
  DepartureDateTime: string;
}
export class CityInfo {
  from: string;
  to: string;
  @IsDateString()
  journyDate: string;
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
