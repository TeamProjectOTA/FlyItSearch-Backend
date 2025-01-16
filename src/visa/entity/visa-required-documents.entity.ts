import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Visa } from './visa.entity';

@Entity('visa_required_documents')
export class VisaRequiredDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profession: string;

  @Column()  
  documents: string;

  @Column('text')
  exceptionalCase: string;

  @Column('text')
  note: string;
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  @OneToOne(() => Visa, visa => visa.visaRequiredDocuments)
  @JoinColumn({ name: 'visa_id' }) 
  visa: Visa;
}
