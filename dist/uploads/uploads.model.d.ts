import { User } from 'src/user/entities/user.entity';
export declare class ProfilePicture {
    id: number;
    filename: string;
    link: string;
    size: number;
    user: User;
}
export declare class VisaPassport {
    id: number;
    personId: string;
    passportLink: string;
    visaLink: string;
}
