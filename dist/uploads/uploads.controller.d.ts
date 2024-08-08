import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(header: Headers, file: Express.Multer.File): Promise<import("./uploads.model").ProfilePicture>;
    deletePicture(header: Headers): Promise<{
        message: string;
        picture: any;
    }>;
}
