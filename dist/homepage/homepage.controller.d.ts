import { HomepageService } from './homepage.service';
import { dataDto } from './homepage.model';
export declare class HomepageController {
    private readonly homePageService;
    constructor(homePageService: HomepageService);
    uploadBannerAndSlider(files: {
        banner?: Express.Multer.File[];
        slider?: Express.Multer.File[];
    }, data: dataDto): Promise<import("./homepage.model").HomePage>;
    data(): Promise<import("./homepage.model").HomePage>;
}
