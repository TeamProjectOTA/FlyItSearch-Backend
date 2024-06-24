import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TourPackage } from './tour-package.entity';

@Entity()
export class TourPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tourPlanTitle: string;

  @Column()
  dayPlan: string;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.tourPlan, {
    onDelete: 'CASCADE',
  })
  tourPackage: TourPackage;
}
