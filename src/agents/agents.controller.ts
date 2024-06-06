import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }
  @Get()
  findAll(@Headers() header: Headers) {
    return this.agentsService.findAll(header);
  }

  @Patch(':agentId')
  update(
    @Param('agentId') agentId: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentsService.update(agentId, updateAgentDto);
  }
  @Delete('/agent:agentId')
  deleteAgent(@Headers() header: Headers, @Param('agentId') agentId: string) {
    return this.agentsService.deleteAgent(header, agentId);
  }
  @Get(':agentId')
  findOne(@Param('agentId') agentId: string) {
    return this.agentsService.findOne(agentId);
  }
}
