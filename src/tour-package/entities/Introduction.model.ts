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

  @Column('json', { nullable: true })
  journeyLocation: any;

  @Column()
  totalSeat: string;

  @Column()
  minimumAge: string;

  @Column()
  maximumAge: string;

  @Column()
  packagePrice: string;
  @Column()
  withAirFare:boolean;

  @Column()
  withHotel:boolean

  @Column()
  packageDiscountType?: string;
  @Column()
  packageDiscountAmount?: string;


  @OneToOne(() => TourPackage, (tourPackage) => tourPackage.introduction,{onDelete: 'CASCADE'})
  @JoinColumn()
  tourPackage: TourPackage;
}
