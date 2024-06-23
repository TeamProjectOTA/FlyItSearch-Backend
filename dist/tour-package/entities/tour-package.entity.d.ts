import { Introduction } from './Introduction.model';
import { Overview } from './overview.model';
import { MetaInfo } from './metaInfo.model';
export declare class TourPackage {
    id: number;
    introduction: Introduction;
    overview: Overview;
    mainImage: MainImage[];
    visitPlace: VisitPlace[];
    tourPlan: TourPlan[];
    objectives: Objectives[];
    metaInfo: MetaInfo;
}
export declare class MainImage {
    id: number;
    path: string;
    size: number;
    mainTitle: string;
    tourPackage: TourPackage;
}
export declare class VisitPlace {
    id: number;
    path: string;
    size: number;
    mainTitle: string;
    tourPackage: TourPackage;
}
export declare class TourPlan {
    id: number;
    tourPlanTitle: string;
    dayPlan: string;
    tourPackage: TourPackage;
}
export declare class Objectives {
    id: number;
    objective: string;
    tourPackage: TourPackage;
}
