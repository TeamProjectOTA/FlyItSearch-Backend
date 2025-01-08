import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ip_whitelist')
export class IPWhitelist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}

export class IPWhitelistDTO {
  @ApiProperty()
  ip_address: string;
  @ApiProperty()
  description?: string;
}
