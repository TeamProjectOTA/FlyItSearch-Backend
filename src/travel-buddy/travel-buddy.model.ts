import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class TravelBuddyDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paxtype: string;
  @ApiProperty()
  @IsString()
  gender: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality: string;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dob: Date;
  @ApiProperty()
  @IsString()
  passport: string;
  @ApiProperty()
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
  nationality: string;
  @Column()
  paxtype: string;
  @Column()
  dob: Date;
  @Column()
  passport: string;
  @Column()
  passportexp: Date;
  @ManyToOne(() => User, (user) => user.travelBuddy, { onDelete: 'CASCADE' })
  user: User;
}
