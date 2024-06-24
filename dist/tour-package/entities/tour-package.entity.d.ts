import { Introduction } from './Introduction.model';
import { Overview } from './overview.model';
import { MetaInfo } from './metaInfo.model';
import { MainImage } from './mainImage.model';
import { VisitPlace } from './visitPlace.model';
import { TourPlan } from './tourPlan.Model';
import { Objectives } from './objective.model';
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
