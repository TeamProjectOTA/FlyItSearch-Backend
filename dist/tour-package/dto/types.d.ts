export declare enum TripType {
    tp1 = "Family Tour",
    tp2 = "Group Tour",
    tp3 = "Relax"
}
export declare enum PackageInclude {
    pI1 = "Flights",
    pI2 = "Hotels",
    pI3 = "Foods",
    pI4 = "Transport"
}
export declare class TravelPackageInclusionDto {
    type: PackageInclude;
    details?: string;
}
export declare class Inclusion {
    data: string;
}
export declare class Exclusion {
    data: string;
}
export declare class BookingPolicy {
    data: string;
}
export declare class RefundPolicy {
    data: string;
}
