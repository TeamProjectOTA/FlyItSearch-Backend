import { Header } from './header.model';
import { Repository } from 'typeorm';
export declare class HomepageService {
    private readonly headerRepository;
    private counter;
    constructor(headerRepository: Repository<Header>);
    saveFiles(files: Express.Multer.File[]): Promise<Header[]>;
    getFileById(id: number): Promise<Header>;
    findMultiple(ids: number[]): Promise<{
        id: number;
        name: string;
        path: string;
    }[]>;
}
