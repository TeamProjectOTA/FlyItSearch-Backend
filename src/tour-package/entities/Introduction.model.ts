import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { TourPackage } from './tourPackage.model';


@Entity('introduction')
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
  journeyStartDate: string;

  @Column()
  journeyEndDate: string;

  @Column()
  countryName: string;

  @Column()
  cityName: string;

  @Column()
  journeyLocation: string;

  @Column()
  totalSeat: string;

  @Column()
  minimumAge: string;

  @Column()
  maximumAge: string;

  @Column()
  packagePrice: string;

  @Column()
  packageDiscount?: string;
  @OneToOne(() => TourPackage, (tourPackage) => tourPackage.introduction,{onDelete: 'CASCADE'})
  @JoinColumn()
  tourPackage: TourPackage;
}
