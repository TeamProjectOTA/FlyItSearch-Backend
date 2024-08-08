import { User } from 'src/user/entities/user.entity';
export declare class ProfilePicture {
    id: number;
    filename: string;
    path: string;
    size: number;
    user: User;
}
