import { Column, Entity,  JoinColumn,  OneToMany,  OneToOne,  PrimaryGeneratedColumn } from 'typeorm';
import { Introduction } from './Introduction.model';
import { TourPlan } from './tourPlan.Model';
import { VisitPlaceImage } from './visitPlaceImage.model';
import { MainImage } from './mainImage.model';

@Entity("tourpackage")
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  packageId: string;
  @Column()
  status: string;
  @Column()
  packageType: string; 
  @Column('json', { nullable: false })
  overView:{
    packageOverView:string;
    packageInclude:string[];
  };
  // @Column('json', { nullable: false })
  // mainImage:string[]
  // @Column('json', { nullable: false })
  // visitPlace:string[]
  @Column('json', { nullable: false })
  tourPlan:any
  @Column('json', { nullable: false })
  objective:{
    inclusion:any
    exclusion:any
    bookingPolicy:any
    refundPolicy:any
  }
  @Column('json', { nullable: false })
  metaInfo:{
    metaTitle:string
    metaKeyword:string[]
    metadescription:string
  }
  @OneToOne(() => Introduction, (introduction) => introduction.tourPackage)
  introduction: Introduction;
  @OneToMany(() => TourPlan, (tourPlan) => tourPlan.tourPackage, { onDelete: 'CASCADE' })
  tourPlans: TourPlan[];
  @OneToMany(() => VisitPlaceImage, (visitPlaceImage) => visitPlaceImage.tourPackage, { onDelete: 'CASCADE' })
  visitPlaceImage: VisitPlaceImage[];
  @OneToMany(() => MainImage, (mainImage) => mainImage.tourPackage, { onDelete: 'CASCADE' })
  mainImage: MainImage[];
}

