import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TourPackage } from "./tourPackage.model";

@Entity('main_image')
export class MainImage{
     @PrimaryGeneratedColumn()
        id:number
        @Column()
        imageUrl: string
        @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.mainImage)
        tourPackage: TourPackage;
}