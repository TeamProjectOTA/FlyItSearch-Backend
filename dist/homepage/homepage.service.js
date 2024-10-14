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
const uuid_1 = require("uuid");
const path = require("path");
let HomepageService = class HomepageService {
    constructor(homePageRepository) {
        this.homePageRepository = homePageRepository;
        this.storage = new storage_1.Storage({
            keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
        });
        this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    }
    async uploadBannerAndSlider(files) {
        let bannerData = null;
        const sliderImages = [];
        const homePage = await this.homePageRepository.findOne({
            where: { id: 1 },
        });
        if (!homePage) {
            throw new common_1.NotFoundException('HomePage record not found.');
        }
        if (files.banner && files.banner.length > 0) {
            const bannerFile = files.banner[0];
            if (homePage.banner && homePage.banner.imageUrl) {
                await this.deleteFileFromGoogleCloud(homePage.banner.imageUrl);
            }
            bannerData = await this.uploadFileToGoogleCloud(bannerFile);
        }
        else if (homePage.banner) {
            bannerData = homePage.banner;
        }
        if (files.slider && files.slider.length > 0) {
            if (homePage.sliderImage && homePage.sliderImage.length > 0) {
                for (const sliderImage of homePage.sliderImage) {
                    await this.deleteFileFromGoogleCloud(sliderImage.imageUrl);
                }
            }
            for (const sliderFile of files.slider) {
                const sliderImageData = await this.uploadFileToGoogleCloud(sliderFile);
                sliderImages.push(sliderImageData);
            }
        }
        else {
            sliderImages.push(...homePage.sliderImage);
        }
        if (!bannerData) {
            throw new common_1.BadRequestException('Banner image is required.');
        }
        if (sliderImages.length > 5) {
            throw new common_1.BadRequestException('A maximum of 5 slider images are allowed.');
        }
        homePage.banner = bannerData;
        homePage.sliderImage = sliderImages;
        return this.homePageRepository.save(homePage);
    }
    async uploadFileToGoogleCloud(file) {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
        }
        const fileSizeKB = (file.size / 1024).toFixed(2);
        const folderName = 'SiteHomePage';
        const fileName = `${folderName}/${(0, uuid_1.v4)()}${fileExtension}`;
        const bucketFile = this.bucket.file(fileName);
        try {
            await bucketFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload file to Google Cloud: ${error.message}`);
        }
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
        return {
            imageUrl: publicUrl,
            size: `${fileSizeKB} KB`,
            type: fileExtension,
        };
    }
    async deleteFileFromGoogleCloud(imageUrl) {
        const fileName = imageUrl.split('/').pop();
        const file = this.bucket.file(fileName);
        try {
            await file.delete();
            console.log(`Successfully deleted file: ${fileName}`);
        }
        catch (error) {
            console.error(`Failed to delete file: ${fileName}`, error.message);
            throw new common_1.BadRequestException(`Failed to delete previous file: ${error.message}`);
        }
    }
    async getalldata() {
        return await this.homePageRepository.findOne({ where: { id: 1 } });
    }
};
exports.HomepageService = HomepageService;
exports.HomepageService = HomepageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(homepage_model_1.HomePage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HomepageService);
//# sourceMappingURL=homepage.service.js.map