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
const header_model_1 = require("./header.model");
const typeorm_2 = require("typeorm");
let HomepageService = class HomepageService {
    constructor(headerRepository) {
        this.headerRepository = headerRepository;
        this.counter = 0;
    }
    async saveFiles(files) {
        try {
            const newFiles = files.map((file) => {
                this.counter += 1;
                const filename = `SliderImage-${this.counter}`;
                return this.headerRepository.create({
                    filename: filename,
                    path: file.path,
                    size: file.size,
                    mimetype: file.mimetype,
                });
            });
            return this.headerRepository.save(newFiles);
        }
        catch (error) {
            console.log(error);
            throw new common_1.NotFoundException();
        }
    }
    async getFileById(id) {
        const file = await this.headerRepository.findOne({ where: { id: id } });
        if (!file) {
            throw new common_1.NotFoundException(`File with ID ${id} not found`);
        }
        return file;
    }
    async findMultiple(ids) {
        const headers = await this.headerRepository.findBy({ id: (0, typeorm_2.In)(ids) });
        const partialHeader = headers.map((header) => ({
            id: header.id,
            name: header.filename,
            path: header.path,
        }));
        if (headers.length === 0) {
            throw new common_1.NotFoundException(`No headers found for the given IDs`);
        }
        return partialHeader;
    }
};
exports.HomepageService = HomepageService;
exports.HomepageService = HomepageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(header_model_1.Header)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HomepageService);
//# sourceMappingURL=homepage.service.js.map