export declare enum Category {
    FLight = "Flight",
    Hotel = "Hotel",
    Tour = "Tour",
    GroupFare = "Group Fare"
}
export declare class TourpackageDto {
    category: Category;
    title: string;
    description: string;
    date: Date;
}
export declare class Tourpackage {
    id: number;
    category: string;
    title: string;
    description: string;
    date: Date;
    picture: string;
}
