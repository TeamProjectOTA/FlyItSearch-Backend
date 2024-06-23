import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlinesModel, AirlinesUpdateModel } from './airlines.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AirlinesService {
  constructor(
    @InjectRepository(AirlinesModel)
    private readonly airlinesRepository: Repository<AirlinesModel>,
    private readonly authService: AuthService,
  ) {}

  async create(header: any, createAirlineDto: AirlinesModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }

    const airlinesData = await this.airlinesRepository.findOne({
      where: { iata: createAirlineDto.iata },
    });

    if (airlinesData) {
      throw new HttpException('Airlines already exist', HttpStatus.CONFLICT);
    }

    return await this.airlinesRepository.save(createAirlineDto);
  }

  async getAirlines(code: string) {
    const airlinesData = await this.airlinesRepository.findOne({
      select: [
        'iata',
        'marketing_name',
        'soto',
        'soti',
        'sito',
        'domestic',
        'addAmount',
        'isBlocked',
        'issuePermit',
        'instantPayment',
        'bookable',
      ],
      where: { iata: code },
    });

    if (!airlinesData) {
      return '';
    }

    return airlinesData;
  }

  async getAirlinesName(code: string) {
    const airlinesData = await this.airlinesRepository.findOne({
      select: ['iata', 'marketing_name'],
      where: { iata: code },
    });

    if (!airlinesData) {
      return '';
    }

    return airlinesData.marketing_name;
  }

  async findAll(header: any) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }

    const data = await this.airlinesRepository.find({
      select: [
        'id',
        'iata',
        'marketing_name',
        'soto',
        'soti',
        'sito',
        'domestic',
        'addAmount',
        'isBlocked',
        'issuePermit',
        'instantPayment',
        'bookable',
      ],
      order: { updatedAt: 'DESC' },
    });

    return data;
  }

  async findOne(header: any, id: number) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }

    const airlinesData = await this.airlinesRepository.findOne({
      where: { id: id },
    });

    if (!airlinesData) {
      throw new NotFoundException('Not found');
    }

    return airlinesData;
  }

  async update(header: any, id: number, updateAirlineDto: AirlinesUpdateModel) {
    const verifyAdminId = await this.authService.verifyAdminToken(header);

    if (!verifyAdminId) {
      throw new UnauthorizedException();
    }

    const airlinesData = await this.airlinesRepository.findOne({
      where: { id: id },
    });

    if (!airlinesData) {
      throw new NotFoundException('Not found');
    }

    return await this.airlinesRepository.update(
      airlinesData.id,
      updateAirlineDto,
    );
  }
}
