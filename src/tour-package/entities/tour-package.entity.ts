import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TripType } from '../dto/create-tour-package.dto';


@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mainTitle: string;

  @Column()
  subTitle: string;

  @Column({ type: 'simple-array' })
  tripType: TripType[];

  @Column()
  journeyDuration: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  countryName: string;

  @Column()
  cityName: string;

  @Column()
  journeyLocation: string;

  @Column()
  totalSeat: string;

  @Column()
  maximunAge: number;

  @Column()
  minimumAge: number;

  @Column()
  packagePrice: number;

  @Column()
  packageDiscount: number;

  @Column()
  packageOverview: string;
}
