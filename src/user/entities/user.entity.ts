import { SaveBooking } from 'src/book/book.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @OneToMany(() => SaveBooking, (saveBooking) => saveBooking.user)
  saveBookings: SaveBooking[];
}
