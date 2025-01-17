import { User } from 'src/user/entities/user.entity';
export declare class TravelBuddyDto {
    title: string;
    firstName: string;
    lastName: string;
    paxtype: string;
    gender: string;
    nationality: string;
    dob: Date;
    passport: string;
    passportexp: Date;
}
export declare class TravelBuddy {
    id: Number;
    title: string;
    firstName: string;
    lastName: string;
    gender: string;
    nationality: string;
    paxtype: string;
    dob: Date;
    passport: string;
    passportexp: Date;
    user: User;
}
