import { BookingSave } from 'src/book/booking.model';
import { Deposit, Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { TravelBuddy } from 'src/travel-buddy/travel-buddy.model';
import { ProfilePicture } from 'src/uploads/uploads.model';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  passengerId: string;
  @Column()
  fullName: string;
  @Column({ nullable: true })
  phone: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  dob: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  nationility: string;
  @Column({ nullable: true })
  passport: string;
  @Column({ default: 'registered' })
  role: string;
  @Column({ nullable: true })
  verificationToken?: string; // Add this field
  @Column({ nullable: true })
  passportexp: string;
  @Column({ default: false })
  emailVerified: boolean;
  @Column({ nullable: true })
  resetPasswordToken: string;
  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;
  @Column({ type: 'int', default: 0 })
  resetAttemptCount: number; // Tracks reset attempts in the current hour
  @Column({ type: 'timestamp', nullable: true })
  resetAttemptTimestamp: Date; // Tracks the timestamp of the first reset attempt in the current hour
  @Column()
  status: string;
  @Column({ nullable: true })
  googleId: string;
  @OneToOne(() => ProfilePicture, (profilePicture) => profilePicture.user)
  profilePicture: ProfilePicture;
  @OneToMany(() => BookingSave, (bookingSave) => bookingSave.user)
  bookingSave: BookingSave[];
  @OneToMany(() => TravelBuddy, (travelBuddy) => travelBuddy.user)
  travelBuddy: TravelBuddy[];
  @OneToMany(() => Transection, (transection) => transection.user)
  transection: Transection[];
  @OneToMany(() => Deposit, (deposit) => deposit.user)
  deposit: Deposit[];
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;
}
