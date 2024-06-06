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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agents_entity_1 = require("./entities/agents.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const auth_service_1 = require("../auth/auth.service");
let AgentsService = class AgentsService {
    constructor(agentRepository, authService) {
        this.agentRepository = agentRepository;
        this.authService = authService;
    }
    async create(createAgentDto) {
        const agentAllReadyExisted = await this.agentRepository.findOne({
            where: { email: createAgentDto.email },
        });
        if (agentAllReadyExisted) {
            throw new common_1.HttpException('Agent already existed. Provide the correct email address. ', common_1.HttpStatus.BAD_REQUEST);
        }
        let add = new agents_entity_1.Agents();
        const agent = await this.agentRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
        let agentId;
        if (agent.length === 1) {
            const lastAgent = agent[0];
            const oldAgentId = lastAgent.agentId.replace('FLYITA', '');
            agentId = 'FLYITA' + (parseInt(oldAgentId) + 1);
        }
        else {
            agentId = 'FLYITA1000';
        }
        add.agentId = agentId;
        add.name = createAgentDto.name;
        add.email = createAgentDto.email;
        add.company = createAgentDto.company;
        add.phone = createAgentDto.phone;
        add.address = createAgentDto.address;
        add.password = createAgentDto.password;
        add.status = createAgentDto.status;
        add.logo = createAgentDto.logo;
        add.credit = createAgentDto.credit;
        add.markuptype = createAgentDto.markuptype;
        add.markup = createAgentDto.markup;
        add.clientmarkuptype = createAgentDto.clientmarkuptype;
        add.clientmarkup = createAgentDto.clientmarkup;
        add.created_at = new Date();
        add.updated_at = new Date();
        add.uid = (0, uuid_1.v4)();
        return await this.agentRepository.save(add);
    }
    async update(agentId, updateAgentDto) {
        const updateAgent = await this.agentRepository.findOne({
            where: { agentId: agentId },
        });
        if (!updateAgent) {
            throw new common_1.NotFoundException();
        }
        if (updateAgentDto.email !== updateAgent.email) {
            const emailExisted = await this.agentRepository.findOne({
                where: { email: updateAgentDto.email },
            });
            if (emailExisted) {
                throw new common_1.BadRequestException('Email already exists. Please enter another email.');
            }
        }
        updateAgent.name = updateAgentDto.name;
        updateAgent.email = updateAgentDto.email;
        updateAgent.company = updateAgentDto.company;
        updateAgent.phone = updateAgentDto.phone;
        updateAgent.address = updateAgentDto.address;
        updateAgent.password = updateAgentDto.password;
        updateAgent.status = updateAgentDto.status;
        updateAgent.logo = updateAgentDto.logo;
        updateAgent.credit = updateAgentDto.credit;
        updateAgent.markuptype = updateAgentDto.markuptype;
        updateAgent.markup = updateAgentDto.markup;
        updateAgent.clientmarkup = updateAgentDto.clientmarkup;
        updateAgent.clientmarkuptype = updateAgentDto.clientmarkuptype;
        updateAgent.updated_at = new Date();
        return await this.agentRepository.save(updateAgent);
    }
    async findAll(header) {
        const admin = await this.authService.verifyAdminToken(header);
        if (!admin) {
            throw new common_1.UnauthorizedException();
        }
        return this.agentRepository.find();
    }
    async deleteAgent(header, agentId) {
        const agentToFind = await this.agentRepository.findOne({
            where: { agentId: agentId },
        });
        const agentToDelete = await this.agentRepository.delete({
            agentId: agentId,
        });
        return { agentToFind, agentToDelete };
    }
    async findOne(agentId) {
        return await this.agentRepository.findOne({ where: { agentId: agentId } });
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agents_entity_1.Agents)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map