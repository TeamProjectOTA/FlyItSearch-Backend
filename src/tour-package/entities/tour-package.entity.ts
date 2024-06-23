import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TravelPackageInclusionDto, TripType } from '../dto/types';

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
}

@Entity()
export class Overview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageOverview: string;

  @Column('json')
  packageInclude: TravelPackageInclusionDto[];
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
  description: string;

  @Column()
  mainTitle: string;
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
  placeName: string;

  @Column()
  description: string;

  @Column()
  mainTitle: string;
}

@Entity()
export class TourPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tourPlanTitle: string;

  @Column()
  dayPlan: string;
}

@Entity()
export class Objectives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  objective: string;
}

@Entity()
export class MetaInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metaTitle: string;

  @Column('simple-array')
  metaKeywords: TripType[];

  @Column()
  metaDescription: string;
}

@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Introduction, { cascade: true })
  @JoinColumn()
  introduction: Introduction;

  @OneToOne(() => Overview, { cascade: true })
  @JoinColumn()
  overview: Overview;

  @OneToMany(() => MainImage, (mainImage) => mainImage.id, { cascade: true })
  mainImage: MainImage[];

  @OneToMany(() => VisitPlace, (visitPlace) => visitPlace.id, { cascade: true })
  visitPlace: VisitPlace[];

  @OneToMany(() => TourPlan, (tourPlan) => tourPlan.id, { cascade: true })
  tourPlan: TourPlan[];

  @OneToMany(() => Objectives, (objectives) => objectives.id, { cascade: true })
  objectives: Objectives[];

  @OneToOne(() => MetaInfo, { cascade: true })
  @JoinColumn()
  metaInfo: MetaInfo;
}
