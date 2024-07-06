import { BookService } from './book.service';
import { File, ResponseDto } from './book.model';
export declare class BookController {
    private readonly fileupload;
    constructor(fileupload: BookService);
    uploadFile(file: Express.Multer.File): Promise<File>;
    getUserInfo(): ResponseDto;
}
