export declare enum Designation {
    Mr = "Mr",
    MRS = "MRS"
}
export declare class ResponseDto {
    code: string;
    message: string;
    response: UserDetails;
}
export declare class UserDetails {
    designation: Designation;
    address: string;
    mobileNumber: string;
    department: string;
    avatar: string;
    gender: string;
    passportNumber: string;
    passportExpireDate: string;
    country: string;
    city: string;
    postCode: string;
    passport: string;
    seatPreference: string;
    mealPreference: string;
    nationality: string;
    frequentFlyerNumber: string;
    passportCopy: string;
    visaCopy: string;
    quickPick: boolean;
    titleName: string;
    givenName: string;
    surName: string;
    address1: string;
    dateOfBirth: string;
    age: string;
    username: string;
    email: string;
    referralCode: string;
    otherPassengers: any[];
    ssr: SsrType[];
}
export declare class Ssr {
    code: string;
    name: string;
}
export declare class SsrType {
    type: string;
    ssr: Ssr[];
}
export declare class File {
    id: number;
    filename: string;
    path: string;
    size: number;
    mimetype: string;
}
