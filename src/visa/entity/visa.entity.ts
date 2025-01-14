import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, DeleteDateColumn } from 'typeorm';
import { DurationCost } from './duration-cost.entity';  // Assuming this is in a separate file
import { VisaRequiredDocuments } from './visa-required-documents.entity';  // Assuming this is in a separate file

@Entity('visa')
export class Visa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departureCountry: string;

  @Column()
  arrivalCountry: string;

  @Column()
  visaCategory: string;

  @Column()
  visaType: string;

  @Column('decimal')
  cost: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => DurationCost, durationCost => durationCost.visa, { cascade: true })
  durationCosts: DurationCost[];

  @OneToOne(() => VisaRequiredDocuments, visaRequiredDocuments => visaRequiredDocuments.visa, { cascade: true })
  visaRequiredDocuments: VisaRequiredDocuments;

 
}
