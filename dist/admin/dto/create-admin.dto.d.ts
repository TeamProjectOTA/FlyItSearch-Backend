declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: Status;
}
export {};
