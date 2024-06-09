import { Response } from 'express';
import { PdfService } from './pdf.service';
import { ReportDto } from './pdf.model';
export declare class PdfController {
    private readonly pdfservice;
    constructor(pdfservice: PdfService);
    generatePdf(jsonData: ReportDto, res: Response): Promise<void>;
    private convertJsonToHtml;
}
