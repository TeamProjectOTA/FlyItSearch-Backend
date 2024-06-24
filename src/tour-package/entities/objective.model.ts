import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TourPackage } from './tour-package.entity';
import {
  BookingPolicy,
  Exclusion,
  Inclusion,
  RefundPolicy,
} from '../dto/types';

@Entity()
export class Objectives {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('json')
  inclusion: Inclusion[];
  @Column('json')
  exclusion: Exclusion[];
  @Column('json')
  bookingPolicy: BookingPolicy[];
  @Column('json')
  refundPolicy: RefundPolicy[];
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.objectives, {
    onDelete: 'CASCADE',
  })
  tourPackage: TourPackage;
}
