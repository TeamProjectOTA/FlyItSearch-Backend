import { SaveBooking } from 'src/book/booking.model';
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
  @Column()
  phone: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: 'registered' })
  role: string;
  @OneToOne(() => ProfilePicture, (profilePicture) => profilePicture.user)
  profilePicture: ProfilePicture;
  @OneToMany(() => SaveBooking, (saveBooking) => saveBooking.user)
  saveBookings: SaveBooking[];
}
