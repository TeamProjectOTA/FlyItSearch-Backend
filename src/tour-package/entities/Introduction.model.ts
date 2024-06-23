import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TourPackage } from "./tour-package.entity";

@Entity()
export class Introduction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mainTitle: string;

  @Column()
  subTitle: string;

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
  maximumAge: number;

  @Column()
  minimumAge: number;

  @Column('decimal')
  packagePrice: number;

  @Column('decimal')
  packageDiscount: number;

  @Column()
  packageOverview: string;
  @OneToOne(() => TourPackage, tourPackage => tourPackage.introduction)
  @JoinColumn()
  tourPackage: TourPackage;
}
