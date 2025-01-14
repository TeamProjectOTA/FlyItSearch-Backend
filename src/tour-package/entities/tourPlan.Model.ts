import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TourPackage } from './tourPackage.model';


@Entity()
export class TourPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  plan: string;

  
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.tourPlans)
  tourPackage: TourPackage;
}
