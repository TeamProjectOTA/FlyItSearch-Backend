import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { ApiTags } from '@nestjs/swagger';
import { ReportDto } from './pdf.model';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfservice: PdfService) {}
  @Post('generate')
  async generatePdf(
    @Body() jsonData: ReportDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Convert JSON data to HTML (this can be customized)
      const htmlContent = this.convertJsonToHtml(jsonData);
      const pdfBuffer = await this.pdfservice.generatePdfFromHtml(htmlContent);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).end(pdfBuffer);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error generating PDF' });
    }
  }

  private convertJsonToHtml(jsonData: any): string {
    const sectionsHtml = jsonData.sections
      .map(
        (section) => `
      <h2>${section.heading}</h2>
      <p>${section.text}</p>
    `,
      )
      .join('');

    return `
      <html>
        <head>
          <title>${jsonData.title}</title>
        </head>
        <body>
          <h1>${jsonData.title}</h1>
          <p>Author: ${jsonData.author}</p>
          <p>Date: ${jsonData.date}</p>
          ${sectionsHtml}
        </body>
      </html>
    `;
  }
}
