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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("./agents.service");
const create_agent_dto_1 = require("./dto/create-agent.dto");
const update_agent_dto_1 = require("./dto/update-agent.dto");
const swagger_1 = require("@nestjs/swagger");
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    create(createAgentDto) {
        return this.agentsService.create(createAgentDto);
    }
    findAll(header) {
        return this.agentsService.findAll(header);
    }
    update(agentId, updateAgentDto) {
        return this.agentsService.update(agentId, updateAgentDto);
    }
    deleteAgent(header, agentId) {
        return this.agentsService.deleteAgent(header, agentId);
    }
    findOne(agentId) {
        return this.agentsService.findOne(agentId);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_dto_1.CreateAgentDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':agentId'),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agent_dto_1.UpdateAgentDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/agent:agentId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "deleteAgent", null);
__decorate([
    (0, common_1.Get)(':agentId'),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findOne", null);
exports.AgentsController = AgentsController = __decorate([
    (0, swagger_1.ApiTags)('Agents'),
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map