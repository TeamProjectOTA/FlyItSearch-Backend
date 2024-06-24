import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TourPackage } from './tour-package.entity';

@Entity()
export class VisitPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  pictureName: string;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.visitPlace, {
    onDelete: 'CASCADE',
  })
  tourPackage: TourPackage;
}
