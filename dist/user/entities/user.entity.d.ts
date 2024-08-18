import { BookingSave, SaveBooking } from 'src/book/booking.model';
import { ProfilePicture } from 'src/uploads/uploads.model';
export declare class User {
    id: number;
    passengerId: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
    nationility: string;
    passport: string;
    role: string;
    verificationToken?: string;
    passportexp: string;
    emailVerified: boolean;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    profilePicture: ProfilePicture;
    saveBookings: SaveBooking[];
    bookingSave: BookingSave[];
}
