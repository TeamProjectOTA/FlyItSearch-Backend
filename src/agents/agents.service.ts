import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agents } from './entities/agents.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agents)
    private readonly agentRepository: Repository<Agents>,
    private readonly authService: AuthService,
  ) {}
  async create(createAgentDto: CreateAgentDto) {
    const agentAllReadyExisted = await this.agentRepository.findOne({
      where: { email: createAgentDto.email },
    });
    if (agentAllReadyExisted) {
      throw new HttpException(
        'Agent already existed. Provide the correct email address. ',
        HttpStatus.BAD_REQUEST,
      );
    }
    let add: Agents = new Agents();
    const agent = await this.agentRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    let agentId: string;
    if (agent.length === 1) {
      const lastAgent = agent[0];
      const oldAgentId = lastAgent.agentId.replace('FLYITA', '');
      agentId = 'FLYITA' + (parseInt(oldAgentId) + 1);
    } else {
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
    add.uid = uuidv4();
    return await this.agentRepository.save(add);
  }

  async update(agentId: string, updateAgentDto: UpdateAgentDto) {
    const updateAgent = await this.agentRepository.findOne({
      where: { agentId: agentId },
    });
    if (!updateAgent) {
      throw new NotFoundException();
    }
    if (updateAgentDto.email !== updateAgent.email) {
      const emailExisted = await this.agentRepository.findOne({
        where: { email: updateAgentDto.email },
      });
      if (emailExisted) {
        throw new BadRequestException(
          'Email already exists. Please enter another email.',
        );
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

  async findAll(header: any) {
    const admin = await this.authService.verifyAdminToken(header);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return this.agentRepository.find();
  }
  async deleteAgent(header: any, agentId: string) {
    /* const verifyAdminId =  this.authservice.verifyAdminToken(header);
 
     if (!verifyAdminId) {
       throw new UnauthorizedException();
     }*/
    const agentToFind = await this.agentRepository.findOne({
      where: { agentId: agentId },
    });
    const agentToDelete = await this.agentRepository.delete({
      agentId: agentId,
    });
    return { agentToFind, agentToDelete };
  }
  async findOne(agentId: string) {
    return await this.agentRepository.findOne({ where: { agentId: agentId } });
  }
}
