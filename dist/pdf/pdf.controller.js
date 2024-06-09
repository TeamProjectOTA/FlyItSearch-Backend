"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const swagger_1 = require("@nestjs/swagger");
const pdf_model_1 = require("./pdf.model");
let PdfController = class PdfController {
    constructor(pdfservice) {
        this.pdfservice = pdfservice;
    }
    async generatePdf(jsonData, res) {
        try {
            const htmlContent = this.convertJsonToHtml(jsonData);
            const pdfBuffer = await this.pdfservice.generatePdfFromHtml(htmlContent);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf',
                'Content-Length': pdfBuffer.length,
            });
            res.status(common_1.HttpStatus.OK).end(pdfBuffer);
        }
        catch (error) {
            res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error generating PDF' });
        }
    }
    convertJsonToHtml(jsonData) {
        const sectionsHtml = jsonData.sections
            .map((section) => `
      <h2>${section.heading}</h2>
      <p>${section.text}</p>
    `)
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
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pdf_model_1.ReportDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generatePdf", null);
exports.PdfController = PdfController = __decorate([
    (0, swagger_1.ApiTags)('PDF'),
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map