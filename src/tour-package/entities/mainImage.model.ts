import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TourPackage } from './tour-package.entity';

@Entity()
export class MainImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mainTitle: string;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.mainImage, {
    onDelete: 'CASCADE',
  })
  tourPackage: TourPackage;
}
