import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agents } from './entities/agents.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
export declare class AgentsService {
    private readonly agentRepository;
    private readonly authService;
    constructor(agentRepository: Repository<Agents>, authService: AuthService);
    create(createAgentDto: CreateAgentDto): Promise<Agents>;
    update(agentId: string, updateAgentDto: UpdateAgentDto): Promise<Agents>;
    findAll(header: any): Promise<Agents[]>;
    deleteAgent(header: any, agentId: string): Promise<{
        agentToFind: Agents;
        agentToDelete: import("typeorm").DeleteResult;
    }>;
    findOne(agentId: string): Promise<Agents>;
}
