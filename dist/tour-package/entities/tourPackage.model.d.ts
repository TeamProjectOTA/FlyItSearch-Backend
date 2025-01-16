import { Introduction } from './Introduction.model';
import { TourPlan } from './tourPlan.Model';
import { VisitPlaceImage } from './visitPlaceImage.model';
import { MainImage } from './mainImage.model';
export declare class TourPackage {
    id: number;
    packageId: string;
    status: string;
    packageType: string;
    overView: {
        packageOverView: string;
        packageInclude: string[];
    };
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
    visitPlaceImage: VisitPlaceImage[];
    mainImage: MainImage[];
}
