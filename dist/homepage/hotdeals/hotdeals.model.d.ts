export declare enum Category {
    FLight = "flight",
    Hotel = "hotel",
    Tour = "tour",
    GroupFare = "groupFare"
}
export declare class HotDealsDto {
    category: Category;
    title: string;
    description: string;
    date: Date;
    picture: string;
}
export declare class HotDeals {
    id: number;
    category: string;
    title: string;
    description: string;
    date: Date;
    pictureName: string;
    path: string;
    size: number;
}
