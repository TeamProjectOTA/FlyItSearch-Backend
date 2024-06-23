import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TravelPackageInclusionDto } from "../dto/types";
import { TourPackage } from "./tour-package.entity";

@Entity()
export class Overview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageOverview: string;

  @Column('json')
  packageInclude: TravelPackageInclusionDto[];
  @OneToOne(() => TourPackage, tourPackage => tourPackage.overview)
  @JoinColumn()
  tourPackage: TourPackage;
}