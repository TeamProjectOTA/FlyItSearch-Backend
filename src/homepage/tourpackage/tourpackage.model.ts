import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Category {
  FLight = 'Flight',
  Hotel = 'Hotel',
  Tour="Tour",
  GroupFare="Group Fare"
}

export class TourpackageDto {
  @IsEnum(Category)
  category: Category;
  @IsString()
  title: string;
  @IsString()
  description: string;
  date: Date;
}

@Entity()
export class Tourpackage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  category: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  date: Date;
  @Column()
  picture: string;
}
