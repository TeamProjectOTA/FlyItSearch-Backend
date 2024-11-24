import { HomePage } from './homepage.model';
import { Repository } from 'typeorm';
export declare class HomepageService {
    private readonly homePageRepository;
    private storage;
    private bucket;
    constructor(homePageRepository: Repository<HomePage>);
    uploadImage(file: Express.Multer.File): Promise<any>;
    create(): Promise<void>;
}
