import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourPackage } from './tour-package.entity';

@Entity()
export class Introduction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mainTitle: string;

  @Column()
  subTitle: string;

  @Column()
  tripType: string;

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
  totalSeat: number;

  @Column()
  maximumAge: number;

  @Column()
  minimumAge: number;

  @Column('decimal')
  packagePrice: number;

  @Column('decimal')
  packageDiscount: number;

  @OneToOne(() => TourPackage, (tourPackage) => tourPackage.introduction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tourPackage: TourPackage;
}
