import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    let browser: any;
    try {
      this.logger.log('Launching browser');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      this.logger.log('Setting page content');
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      });

      this.logger.log('Generating PDF');
      const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 });

      return pdfBuffer;
    } catch (error) {
      this.logger.error('Error generating PDF', error);
      throw new Error('Error generating PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
