import { SaveBooking } from 'src/book/booking.model';
import { ProfilePicture } from 'src/uploads/uploads.model';
export declare class User {
    id: number;
    passengerId: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    profilePicture: ProfilePicture;
    saveBookings: SaveBooking[];
}
