export declare enum Category {
    FLight = "flight",
    Hotel = "hotel",
    Tour = "tour",
    GroupFare = "groupFare"
}
export declare class TourpackageDto {
    category: Category;
    title: string;
    description: string;
    date: Date;
    picture: string;
}
export declare class Tourpackage {
    id: number;
    category: string;
    title: string;
    description: string;
    date: Date;
    pictureName: string;
    path: string;
    size: number;
}
