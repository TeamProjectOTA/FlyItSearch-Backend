import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';

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

  async generatePdf(data: any): Promise<Buffer> {
    const templateHtml = fs.readFileSync(
      path.join(__dirname, '../../src/pdf/pdf2.html'),
      'utf8',
    );
    const template = Handlebars.compile(templateHtml);
    const html = template(data[0]);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return pdfBuffer;
  }
}
