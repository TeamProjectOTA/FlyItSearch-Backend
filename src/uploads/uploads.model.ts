import { Deposit } from 'src/deposit/deposit.model';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProfilePicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @OneToOne(() => User, (user) => user.profilePicture, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}

