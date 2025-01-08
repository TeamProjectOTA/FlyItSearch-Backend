import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPWhitelist, IPWhitelistDTO } from './whitelist.model';
import { Repository } from 'typeorm';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(IPWhitelist)
    private readonly ipWhitelistRepository: Repository<IPWhitelist>,
  ) {}

  async findAll() {
    const data = await this.ipWhitelistRepository.find({
      select: ['ip_address'],
    });
    const ipAddress = data.map((item) => item.ip_address);

    return ipAddress;
  }

  async save(ipWhitelistDTO: IPWhitelistDTO) {
    const save = this.ipWhitelistRepository.create(ipWhitelistDTO);
    return await this.ipWhitelistRepository.save(save);
  }
}
