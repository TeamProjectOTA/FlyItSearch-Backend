import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IpAddress } from './ip.model';

@Injectable()
export class IpService {
  constructor(
    @InjectRepository(IpAddress)
    private readonly ipRepository: Repository<IpAddress>,
  ) {}

  async findOne(ip: string): Promise<IpAddress> {
    return this.ipRepository.findOne({ where: { ip } });
  }

  async create(
    ip: string,
    role: string,
    points: number,
    lastRequestTime: number,
  ): Promise<IpAddress> {
    const ipAddress = this.ipRepository.create({
      ip,
      role,
      points,
      lastRequestTime,
    });
    return this.ipRepository.save(ipAddress);
  }

  async createOrUpdate(
    ip: string,
    role: string,
    points: number,
    lastRequestTime: number,
  ): Promise<IpAddress> {
    let ipAddress = await this.findOne(ip);
    if (ipAddress) {
      ipAddress.role = role;
      ipAddress.points = points;
      ipAddress.lastRequestTime = lastRequestTime;
      return this.ipRepository.save(ipAddress);
    } else {
      return this.create(ip, role, points, lastRequestTime);
    }
  }

  async delete(ip: string): Promise<void> {
    await this.ipRepository.delete({ ip });
  }

  async cleanupOldIps(expirationTime: number): Promise<void> {
    await this.ipRepository.delete({
      lastRequestTime: LessThan(expirationTime),
    });
  }
}