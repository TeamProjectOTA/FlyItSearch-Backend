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
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
let UploadsService = class UploadsService {
    constructor(profilePictureRepository, authservice, userRepository) {
        this.profilePictureRepository = profilePictureRepository;
        this.authservice = authservice;
        this.userRepository = userRepository;
        this.storage = new storage_1.Storage({
            keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
        });
        this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
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
                const bucketFile = this.storage
                    .bucket(this.bucket)
                    .file(existingProfilePicture.filename);
                await bucketFile.delete();
                await this.profilePictureRepository.remove(existingProfilePicture);
            }
            catch (error) {
                console.error('Error deleting file from Google Cloud:', error.message);
                throw new common_1.BadRequestException('Failed to delete existing profile picture.');
            }
        }
        const fileExtension = (0, path_1.extname)(file.originalname);
        const folderName = 'ProfilePicture';
        const filename = `${folderName}/${user.passengerId}-ProfilePicture${fileExtension}${(0, uuid_1.v4)()}`;
        try {
            const bucketFile = this.storage.bucket(this.bucket).file(filename);
            await bucketFile.save(file.buffer, {
                contentType: file.mimetype,
                public: true,
            });
            const publicUrl = `https://storage.googleapis.com/${this.bucket}/${filename}`;
            const profilePicture = this.profilePictureRepository.create({
                user,
                filename,
                link: publicUrl,
                size: file.size,
            });
            const save = await this.profilePictureRepository.save(profilePicture);
            return { Message: "Image Uploaded Successful", save };
        }
        catch (error) {
            console.error('Error uploading file to Google Cloud:', error.message);
            throw new common_1.BadRequestException('Failed to upload and save profile picture.');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uploads_model_1.ProfilePicture)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService,
        typeorm_2.Repository])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map