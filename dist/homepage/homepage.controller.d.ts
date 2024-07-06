import { HomepageService } from './homepage.service';
import { Header } from './header.model';
import { Response } from 'express';
export declare class HomepageController {
    private readonly fileupload;
    constructor(fileupload: HomepageService);
    uploadFiles(files: Express.Multer.File[]): Promise<Header[]>;
    getFile(id: number, res: Response): Promise<void>;
    findMultiple(ids: string): Promise<Partial<Header>[]>;
}
