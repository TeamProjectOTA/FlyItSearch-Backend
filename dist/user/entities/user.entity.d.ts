import { BookingSave } from 'src/book/booking.model';
import { Transection } from 'src/transection/transection.model';
import { TravelBuddy } from 'src/travel-buddy/travel-buddy.model';
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
    status: string;
    googleId: string;
    profilePicture: ProfilePicture;
    bookingSave: BookingSave[];
    travelBuddy: TravelBuddy[];
    transection: Transection[];
}
