import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    create(createAgentDto: CreateAgentDto): Promise<import("./entities/agents.entity").Agents>;
    findAll(header: Headers): Promise<import("./entities/agents.entity").Agents[]>;
    update(agentId: string, updateAgentDto: UpdateAgentDto): Promise<import("./entities/agents.entity").Agents>;
    deleteAgent(header: Headers, agentId: string): Promise<{
        agentToFind: import("./entities/agents.entity").Agents;
        agentToDelete: import("typeorm").DeleteResult;
    }>;
    findOne(agentId: string): Promise<import("./entities/agents.entity").Agents>;
}
