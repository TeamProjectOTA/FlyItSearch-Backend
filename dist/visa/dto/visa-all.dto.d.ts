export declare class DurationCostDto {
    cost: number;
    entry: string;
    duration: string;
    maximumStay: string;
    processingTime: string;
}
export declare class VisaRequiredDocumentsDto {
    profession: string;
    documents: any[];
    exceptionalCase: string;
    note: string;
}
export declare class VisaAllDto {
    departureCountry: string;
    arrivalCountry: string;
    visaCategory: string;
    visaType: string;
    cost: number;
    durationCosts?: DurationCostDto[];
    visaRequiredDocuments?: VisaRequiredDocumentsDto[];
}
