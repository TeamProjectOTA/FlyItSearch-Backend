import { IsInt, Min } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IpAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  role: string;

  @Column('int')
  @IsInt()
  @Min(0)
  points: number;

  @Column('bigint')
  lastRequestTime: number;
}
