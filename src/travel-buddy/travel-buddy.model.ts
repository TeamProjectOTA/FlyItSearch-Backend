import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class TravelBuddyDto {
  @IsString()
  title: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  gender: string;
  @IsString()
  nationility: string;
  @IsDate()
  @Type(() => Date)
  dob: Date;
  @IsString()
  passport: string;
  @IsDate()
  @Type(() => Date)
  passportexp: Date;
}

@Entity()
export class TravelBuddy {
  @PrimaryGeneratedColumn()
  id: Number;
  @Column()
  title: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  gender: string;
  @Column()
  nationility: string;
  @Column()
  dob: Date;
  @Column()
  passport: string;
  @Column()
  passportexp: Date;
  @ManyToOne(() => User, (user) => user.travelBuddy, { onDelete: 'CASCADE' })
  user: User;
}
