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
exports.HomepageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const homepage_model_1 = require("./homepage.model");
const typeorm_2 = require("typeorm");
const storage_1 = require("@google-cloud/storage");
let HomepageService = class HomepageService {
    constructor(homePageRepository) {
        this.homePageRepository = homePageRepository;
        this.storage = new storage_1.Storage({
            keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
        });
        this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    }
    async uploadImage(file) {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const random = `${timestamp}${randomNumber}`;
        const folderName = 'SiteHomePage';
        const fileName = `${folderName}/${random}-image`;
        const blob = this.storage.bucket(this.bucket).file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype },
            public: true,
        });
        const link = await new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
                resolve(publicUrl);
            });
            blobStream.end(file.buffer);
        });
        return { link: link };
    }
    async create() { }
};
exports.HomepageService = HomepageService;
exports.HomepageService = HomepageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(homepage_model_1.HomePage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HomepageService);
//# sourceMappingURL=homepage.service.js.map