import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourPackage } from './tour-package.entity';

@Entity()
export class MetaInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metaTitle: string;

  @Column('simple-array')
  metaKeywords: string[];

  @Column()
  metaDescription: string;

  @OneToOne(() => TourPackage, (tourPackage) => tourPackage.metaInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tourPackage: TourPackage;
}
