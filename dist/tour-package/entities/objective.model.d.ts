import { TourPackage } from './tour-package.entity';
import { BookingPolicy, Exclusion, Inclusion, RefundPolicy } from '../dto/types';
export declare class Objectives {
    id: number;
    inclusion: Inclusion[];
    exclusion: Exclusion[];
    bookingPolicy: BookingPolicy[];
    refundPolicy: RefundPolicy[];
    tourPackage: TourPackage;
}
