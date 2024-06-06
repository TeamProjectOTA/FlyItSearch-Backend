import { Response } from 'express';
import { PdfService } from './pdf.service';
export declare class PdfController {
    private readonly pdfservice;
    constructor(pdfservice: PdfService);
    generatePdf(jsonData: any, res: Response): Promise<void>;
    private convertJsonToHtml;
}
