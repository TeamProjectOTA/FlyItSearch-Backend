// src/ip-address/ip-address.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpAddress } from './ip-address.model';

@Injectable()
export class IpAddressService {
  constructor(
    @InjectRepository(IpAddress)
    private readonly ipAddressRepository: Repository<IpAddress>,
  ) {}

  async getCount(ip: string): Promise<number> {
    const record = await this.ipAddressRepository.findOne({ where: { ip } });
    return record ? record.count : 0;
  }

  async getTimestamp(ip: string): Promise<Date> {
    const record = await this.ipAddressRepository.findOne({ where: { ip } });
    return record ? record.updatedAt : new Date(0); // Return epoch if no record found
  }

  async resetCount(ip: string): Promise<void> {
    const record = await this.ipAddressRepository.findOne({ where: { ip } });
    if (record) {
      record.count = 0;
      record.updatedAt = new Date();
      await this.ipAddressRepository.save(record);
    }
  }

  async incrementCount(ip: string): Promise<void> {
    let record = await this.ipAddressRepository.findOne({ where: { ip } });
    if (!record) {
      record = new IpAddress();
      record.ip = ip;
      record.count = 0;
    }
    record.count += 1;
    record.updatedAt = new Date();
    await this.ipAddressRepository.save(record);
  }
}
