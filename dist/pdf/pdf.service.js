"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
const path = require("path");
const Handlebars = require("handlebars");
const fs = require("fs");
let PdfService = PdfService_1 = class PdfService {
    constructor() {
        this.logger = new common_1.Logger(PdfService_1.name);
    }
    async generatePdfFromHtml(htmlContent) {
        let browser;
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
        }
        catch (error) {
            this.logger.error('Error generating PDF', error);
            throw new Error('Error generating PDF');
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    }
    async generatePdf(data) {
        const templateHtml = fs.readFileSync(path.join(__dirname, '../../src/pdf/pdf.html'), 'utf8');
        const template = Handlebars.compile(templateHtml);
        const html = template(data[0]);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
        return pdfBuffer;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map