import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, Column } from 'typeorm';
import { Introduction } from './Introduction.model';
import { Overview } from './overview.model';
import { MetaInfo } from './metaInfo.model';
import { MainImage } from './mainImage.model';
import { VisitPlace } from './visitPlace.model';
import { TourPlan } from './tourPlan.Model';
import { Objectives } from './objective.model';

@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tourpackageId:string

  @OneToOne(() => Introduction, (introduction) => introduction.tourPackage, {
    cascade: true,
  })
  introduction: Introduction;

  @OneToOne(() => Overview, (overview) => overview.tourPackage, {
    cascade: true,
  })
  overview: Overview;

  @OneToMany(() => MainImage, (mainImage) => mainImage.tourPackage, {
    cascade: true,
  })
  mainImage: MainImage[];

  @OneToMany(() => VisitPlace, (visitPlace) => visitPlace.tourPackage, {
    cascade: true,
  })
  visitPlace: VisitPlace[];

  @OneToMany(() => TourPlan, (tourPlan) => tourPlan.tourPackage, {
    cascade: true,
  })
  tourPlan: TourPlan[];

  @OneToMany(() => Objectives, (objectives) => objectives.tourPackage, {
    cascade: true,
  })
  objectives: Objectives[];

  @OneToOne(() => MetaInfo, (metaInfo) => metaInfo.tourPackage, {
    cascade: true,
  })
  metaInfo: MetaInfo;
}
