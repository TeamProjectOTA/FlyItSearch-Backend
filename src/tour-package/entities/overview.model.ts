import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourPackage } from './tour-package.entity';
import { TravelPackageInclusionDto } from '../dto/types';

@Entity()
export class Overview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageOverview: string;

  @Column('json')
  packageInclude: TravelPackageInclusionDto[];

  @OneToOne(() => TourPackage, (tourPackage) => tourPackage.overview, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tourPackage: TourPackage;
}
