import { User } from 'src/user/entities/user.entity';
export declare class ProfilePicture {
    id: number;
    filename: string;
    link: string;
    size: number;
    user: User;
}
