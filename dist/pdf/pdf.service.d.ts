export declare class PdfService {
    private readonly logger;
    generatePdfFromHtml(htmlContent: string): Promise<Buffer>;
}
