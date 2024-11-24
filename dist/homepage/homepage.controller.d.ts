import { HomepageService } from './homepage.service';
export declare class HomepageController {
    private readonly homePageService;
    constructor(homePageService: HomepageService);
    uploadImage(file: Express.Multer.File): Promise<any>;
}
