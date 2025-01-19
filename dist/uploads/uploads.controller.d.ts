import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(header: Headers, file: Express.Multer.File): Promise<any>;
    uploadImage(file: Express.Multer.File, res: Response): Promise<void>;
    uploadVisitPlaceImages(tourPackageId: number, files: Express.Multer.File[]): Promise<import("../tour-package/entities/visitPlaceImage.model").VisitPlaceImage[]>;
    patchVisitPlaceImageByTourPackage(tourPackageId: number, file: Express.Multer.File): Promise<any>;
    uploadMainImage(tourPackageId: number, files: Express.Multer.File[]): Promise<import("../tour-package/entities/mainImage.model").MainImage[]>;
    updateMainImages(tourPackageId: number, file: Express.Multer.File): Promise<any>;
    uploadImageUpdate(file: any, existingImageLink?: string): Promise<any>;
}
