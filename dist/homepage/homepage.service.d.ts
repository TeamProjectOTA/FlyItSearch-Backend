import { dataDto, HomePage } from './homepage.model';
import { Repository } from 'typeorm';
export declare class HomepageService {
    private readonly homePageRepository;
    private storage;
    private bucket;
    constructor(homePageRepository: Repository<HomePage>);
    uploadBannerAndSlider(files: {
        banner?: Express.Multer.File[];
        slider?: Express.Multer.File[];
    }, data: dataDto): Promise<HomePage>;
    uploadFileToGoogleCloud(file: Express.Multer.File): Promise<{
        imageUrl: string;
        size: string;
        type: string;
    }>;
    deleteFileFromGoogleCloud(imageUrl: string): Promise<void>;
    getalldata(): Promise<HomePage>;
}
