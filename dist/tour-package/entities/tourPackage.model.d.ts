import { Introduction } from './Introduction.model';
import { TourPlan } from './tourPlan.Model';
export declare class TourPackage {
    id: number;
    packageId: string;
    status: string;
    packageType: string;
    overView: {
        packageOverView: string;
        packageInclude: string[];
    };
    mainImage: string[];
    visitPlace: string[];
    tourPlan: any;
    objective: {
        inclusion: any;
        exclusion: any;
        bookingPolicy: any;
        refundPolicy: any;
    };
    metaInfo: {
        metaTitle: string;
        metaKeyword: string[];
        metadescription: string;
    };
    introduction: Introduction;
    tourPlans: TourPlan[];
}
