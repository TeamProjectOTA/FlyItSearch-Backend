import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Category {
  FLight = 'flight',
  Hotel = 'hotel',
  Tour = 'tour',
  GroupFare = 'groupFare',
}

export class TourpackageDto {
  @IsEnum(Category)
  category: Category;
  @IsString()
  title: string;
  @IsString()
  description: string;
  date: Date;
  picture: string;
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
  pictureName: string;
  @Column()
  path: string;
  @Column()
  size: number;
}
