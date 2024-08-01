import { SaveBooking } from 'src/book/book.model';
export declare class User {
    id: number;
    passengerId: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    saveBookings: SaveBooking[];
}
