import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Visa } from './visa.entity';

@Entity('duration_cost')
export class DurationCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  cost: number;

  @Column()
  entry: string;

  @Column()
  duration: string;

  @Column()
  maximumStay: string;

  @Column()
  processingTime: string;

  @ManyToOne(() => Visa, visa => visa.durationCosts)
  visa: Visa;
}
