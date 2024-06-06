import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('agents')
export class Agents {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  agentId: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  company: string;
  @Column()
  phone: string;
  @Column()
  address: string;
  @Column()
  password: string;
  @Column()
  status: string;
  @Column()
  logo: string;
  @Column()
  credit: number;
  @Column()
  markuptype: string;
  @Column()
  markup: number;
  @Column()
  clientmarkuptype: string;
  @Column()
  clientmarkup: number;
  @Column()
  created_at: Date;
  @Column()
  updated_at: Date;
  @Column()
  uid: string;
}
