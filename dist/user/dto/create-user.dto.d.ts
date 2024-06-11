export declare enum Role {
    Admin = "admin",
    superAdmin = "superAdmin",
    registered = "registred",
    unregistered = "unregistered"
}
export declare class CreateUserDto {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: Role;
}
