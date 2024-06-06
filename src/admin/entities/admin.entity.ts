import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  adminid: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  password: string;
  @Column({ default: 'super Admin' })
  role: string;
  @Column()
  status: string;
  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;
  @Column()
  uuid: string;
}
