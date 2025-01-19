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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const uploads_model_1 = require("./uploads.model");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const path_1 = require("path");
const auth_service_1 = require("../auth/auth.service");
const uuid_1 = require("uuid");
const AWS = require("aws-sdk");
const upload_provider_service_1 = require("./upload.provider.service");
const dotenv = require("dotenv");
const visitPlaceImage_model_1 = require("../tour-package/entities/visitPlaceImage.model");
const mainImage_model_1 = require("../tour-package/entities/mainImage.model");
const tourPackage_model_1 = require("../tour-package/entities/tourPackage.model");
dotenv.config();
let UploadsService = class UploadsService {
    constructor(s3, profilePictureRepository, authservice, userRepository, visitPlaceImageRepository, mainImageRepository, tourPackageRepository) {
        this.s3 = s3;
        this.profilePictureRepository = profilePictureRepository;
        this.authservice = authservice;
        this.userRepository = userRepository;
        this.visitPlaceImageRepository = visitPlaceImageRepository;
        this.mainImageRepository = mainImageRepository;
        this.tourPackageRepository = tourPackageRepository;
    }
    async uploadImage(file, res) {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const random = `${timestamp}${randomNumber}`;
        const folderName = 'PassportVisa';
        const fileExtension = (0, path_1.extname)(file.originalname);
        const fileName = `${folderName}/${random}-image${fileExtension}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        this.s3.putObject(params, (err, data) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ status: 'error', message: 'Error uploading file' });
            }
            else {
                const url = process.env.CDN_SPACES + '/' + fileName;
                return res.status(201).json({ link: url });
            }
        });
    }
    async create(header, file) {
        const decodeToken = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email: decodeToken },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found.');
        }
        const existingProfilePicture = await this.profilePictureRepository.findOne({
            where: { user },
        });
        if (existingProfilePicture) {
            try {
                await this.s3
                    .deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: existingProfilePicture.filename,
                })
                    .promise();
                console.log('File deleted from AWS S3:', existingProfilePicture.filename);
                await this.profilePictureRepository.remove(existingProfilePicture);
            }
            catch (error) {
                console.error('Error deleting file from AWS S3:', error.message);
                throw new common_1.BadRequestException('Failed to delete the profile picture.');
            }
        }
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'ProfilePicture';
        const filename = `${folderName}/${user.passengerId}-ProfilePicture-${(0, uuid_1.v4)()}${fileExtension}`;
        try {
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };
            await this.s3.upload(uploadParams).promise();
            const publicUrl = `${process.env.CDN_SPACES}/${filename}`;
            const profilePicture = this.profilePictureRepository.create({
                user,
                filename,
                link: publicUrl,
                size: file.size,
            });
            const save = await this.profilePictureRepository.save(profilePicture);
            return {
                Message: 'Image Uploaded Successfully',
                save: { link: save.link, size: save.size },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to upload and save profile picture.' + error);
        }
    }
    async saveVisitPlaceImages(tourPackageId, files) {
        if (files.length < 1 || files.length > 6) {
            throw new common_1.HttpException('You must upload between 1 to 6 images.', common_1.HttpStatus.BAD_REQUEST);
        }
        const tourPackage = await this.tourPackageRepository.findOne({
            where: { id: tourPackageId },
            relations: ['visitPlaceImage'],
        });
        if (!tourPackage) {
            throw new common_1.HttpException('TourPackage not found', common_1.HttpStatus.NOT_FOUND);
        }
        const existingImagesCount = tourPackage.visitPlaceImage.length;
        const savedImages = [];
        const packageId = tourPackage.packageId;
        if (existingImagesCount > 6) {
            throw new common_1.ConflictException('You Can not add more than 6 picture to a tourpackage VisitPlaceImage');
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadedImageUrl = await this.uploadSingleToDO(packageId, file);
            const visitPlaceImage = this.visitPlaceImageRepository.create({
                imageUrl: uploadedImageUrl,
                index: existingImagesCount + i + 1,
                tourPackage,
            });
            const savedImage = await this.visitPlaceImageRepository.save(visitPlaceImage);
            savedImages.push(savedImage);
        }
        return savedImages;
    }
    async uploadSingleToDO(packageId, file) {
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'tourpackage/Visitplaceimage';
        const filename = `${folderName}/${packageId}-visitPlace-${(0, uuid_1.v4)()}${fileExtension}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        try {
            const data = await this.s3.upload(params).promise();
            return `${process.env.CDN_SPACES}/${filename}`;
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new common_1.HttpException('Error uploading file to DigitalOcean Spaces', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateVisitPlaceByTourPackage(id, file) {
        const visitPlaceImages = await this.visitPlaceImageRepository.findOne({
            where: { id: id },
            relations: ['tourPackage']
        });
        const tourPackage = visitPlaceImages.tourPackage;
        if (!visitPlaceImages) {
            throw new common_1.NotFoundException('No images found for the given tour package');
        }
        try {
            const image = visitPlaceImages;
            const key = image.imageUrl.split(`${process.env.CDN_SPACES}/`)[1];
            await this.s3
                .deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
            })
                .promise();
            console.log('File deleted from AWS S3:', key);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete existing images from AWS S3');
        }
        const packageId = tourPackage.packageId;
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'tourpackageVisitplaceimage';
        const filename = `${folderName}/${packageId}-visitPlace-${(0, uuid_1.v4)()}${fileExtension}`;
        try {
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };
            await this.s3.upload(uploadParams).promise();
            const publicUrl = `${process.env.CDN_SPACES}/${filename}`;
            const image = visitPlaceImages;
            image.imageUrl = publicUrl;
            await this.visitPlaceImageRepository.save(image);
            return {
                message: 'Image URLs updated successfully for the tour package',
                images: visitPlaceImages,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to upload and update image URLs');
        }
    }
    async saveMainImage(tourPackageId, files) {
        if (files.length < 1 || files.length > 6) {
            throw new common_1.HttpException('You must upload between 1 to 6 images.', common_1.HttpStatus.BAD_REQUEST);
        }
        const tourPackage = await this.tourPackageRepository.findOne({
            where: { id: tourPackageId },
            relations: ['mainImage'],
        });
        if (!tourPackage) {
            throw new common_1.HttpException('TourPackage not found', common_1.HttpStatus.NOT_FOUND);
        }
        const existingImagesCount = tourPackage.mainImage.length;
        const savedImages = [];
        const packageId = tourPackage.packageId;
        if (existingImagesCount >= 6) {
            throw new common_1.ConflictException('You Can not add more than 6 picture to a tourpackage VisitPlaceImage');
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadedImageUrl = await this.singlePictureUploadToMainImage(packageId, file);
            const mainImage = this.mainImageRepository.create({
                imageUrl: uploadedImageUrl,
                index: existingImagesCount + i + 1,
                tourPackage,
            });
            const savedImage = await this.mainImageRepository.save(mainImage);
            savedImages.push(savedImage);
        }
        return savedImages;
    }
    async singlePictureUploadToMainImage(packageId, file) {
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'tourpackage/MainImage';
        const filename = `${folderName}/${packageId}-mainImage-${(0, uuid_1.v4)()}${fileExtension}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        try {
            const data = await this.s3.upload(params).promise();
            return `${process.env.CDN_SPACES}/${filename}`;
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new common_1.HttpException('Error uploading file to DigitalOcean Spaces', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async mainImageUpdateByTourPackage(id, file) {
        const mainImage = await this.mainImageRepository.findOne({
            where: { id: id },
            relations: ['tourPackage']
        });
        if (!mainImage) {
            throw new common_1.NotFoundException('No images found for the given tour package');
        }
        const tourPackage = mainImage.tourPackage;
        try {
            const image = mainImage;
            const key = image.imageUrl.split(`${process.env.CDN_SPACES}/`)[1];
            await this.s3
                .deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
            })
                .promise();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete existing images from AWS S3');
        }
        const packageId = tourPackage.packageId;
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'tourpackage/MainImage';
        const filename = `${folderName}/${packageId}-mainImage-${(0, uuid_1.v4)()}${fileExtension}`;
        try {
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };
            await this.s3.upload(uploadParams).promise();
            const publicUrl = `${process.env.CDN_SPACES}/${filename}`;
            const image = mainImage;
            image.imageUrl = publicUrl;
            await this.mainImageRepository.save(image);
            return {
                message: 'Image URLs updated successfully for the tour package',
                images: mainImage,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to upload and update image URLs');
        }
    }
    async uploadImageUpdate(file, existingImageLink) {
        if (existingImageLink) {
            const existingFileName = existingImageLink.split('/').pop();
            const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: existingFileName,
            };
            try {
                await this.s3.deleteObject(deleteParams).promise();
                console.log('Existing image deleted');
            }
            catch (err) {
                console.error('Error deleting existing image:', err);
                throw new Error('Error deleting existing image');
            }
        }
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const random = `${timestamp}${randomNumber}`;
        const folderName = 'PassportVisa';
        const fileExtension = (0, path_1.extname)(file.originalname);
        const fileName = `${folderName}/${random}-image${fileExtension}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        try {
            await this.s3.putObject(params).promise();
            const url = process.env.CDN_SPACES + '/' + fileName;
            return { link: url };
        }
        catch (err) {
            console.error('Error uploading file:', err);
            throw new Error('Error uploading file');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(upload_provider_service_1.DoSpacesServiceLib)),
    __param(1, (0, typeorm_1.InjectRepository)(uploads_model_1.ProfilePicture)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(visitPlaceImage_model_1.VisitPlaceImage)),
    __param(5, (0, typeorm_1.InjectRepository)(mainImage_model_1.MainImage)),
    __param(6, (0, typeorm_1.InjectRepository)(tourPackage_model_1.TourPackage)),
    __metadata("design:paramtypes", [AWS.S3, typeorm_2.Repository,
        auth_service_1.AuthService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map