import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TripType } from "../dto/types";
import { TourPackage } from "./tour-package.entity";

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
  @OneToOne(() => TourPackage, tourPackage => tourPackage.metaInfo)
  @JoinColumn()
  tourPackage: TourPackage;
}