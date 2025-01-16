import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(header: Headers, file: Express.Multer.File): Promise<any>;
    uploadImage(file: Express.Multer.File, res: Response): Promise<void>;
}
