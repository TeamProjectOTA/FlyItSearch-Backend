import { HomepageService } from './homepage.service';
export declare class HomepageController {
    private readonly homePageService;
    constructor(homePageService: HomepageService);
    uploadBannerAndSlider(files: {
        banner?: Express.Multer.File[];
        slider?: Express.Multer.File[];
    }): Promise<import("./homepage.model").HomePage>;
    data(): Promise<import("./homepage.model").HomePage>;
}
