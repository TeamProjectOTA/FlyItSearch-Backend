import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Visa } from './visa.entity';

@Entity('visa_required_documents')
export class VisaRequiredDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profession: string;

  @Column('json')  
  documents: any;

  @Column('text')
  exceptionalCase: string;

  @Column('text')
  note: string;

  @OneToOne(() => Visa, visa => visa.visaRequiredDocuments)
  @JoinColumn({ name: 'visa_id' }) 
  visa: Visa;
}
