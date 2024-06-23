import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TravelPackageInclusionDto, TripType } from '../dto/types';
import { Introduction } from './Introduction.model';
import { Overview } from './overview.model';
import { MetaInfo } from './metaInfo.model';

@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Introduction, { cascade: true, eager: true })
  @JoinColumn()
  introduction: Introduction;

  @OneToOne(() => Overview, { cascade: true, eager: true })
  @JoinColumn()
  overview: Overview;

  @OneToMany(() => MainImage, (mainImage) => mainImage.id, { cascade: true, eager: true })
  mainImage: MainImage[];

  @OneToMany(() => VisitPlace, (visitPlace) => visitPlace.id, { cascade: true })
  visitPlace: VisitPlace[];

  @OneToMany(() => TourPlan, (tourPlan) => tourPlan.id, { cascade: true })
  tourPlan: TourPlan[];

  @OneToMany(() => Objectives, (objectives) => objectives.id, { cascade: true })
  objectives: Objectives[];

  @OneToOne(() => MetaInfo, { cascade: true, eager: true })
  @JoinColumn()
  metaInfo: MetaInfo;
}



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
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.mainImage)
  tourPackage: TourPackage;
}

@Entity()
export class VisitPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  size: number;
  @Column()
  mainTitle: string;
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.visitPlace)
  tourPackage: TourPackage;
}

@Entity()
export class TourPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tourPlanTitle: string;

  @Column()
  dayPlan: string;
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.tourPlan)
  tourPackage: TourPackage;
}

@Entity()
export class Objectives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  objective: string;
  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.objectives)
  tourPackage: TourPackage;
}
