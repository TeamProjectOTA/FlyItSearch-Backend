import { BookingSave } from 'src/book/booking.model';
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
  link: string;

  @Column()
  size: number;

  @OneToOne(() => User, (user) => user.profilePicture, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}

@Entity()
export class VisaPassport {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  passportLink: string;
  @Column()
  visaLink: string;
  @OneToOne(() => BookingSave, (bookingSave) => bookingSave.visaPassport, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bookingSave: BookingSave;
}
