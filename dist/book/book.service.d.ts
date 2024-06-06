/// <reference types="multer" />
import { Repository } from 'typeorm';
import { File } from './book.model';
export declare class BookService {
    private readonly fileRepository;
    constructor(fileRepository: Repository<File>);
    saveFile(file: Express.Multer.File): Promise<File>;
}
