import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity({ name: 'airportsdata' })
export class AirportsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iata: string;

  @Column()
  icao: string;

  @Column()
  name: string;

  @Column()
  city_code: string;

  @Column()
  country_code: string;

  @Column()
  timezone: string;

  @Column()
  utc: string;

  @Column({ type: 'decimal', precision: 8, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'updated_at' })
  updated_at: Date;

  @Column()
  @Generated('uuid')
  uid: string;
}

export class AirportsModelUpdate {
  @ApiProperty()
  iata: string;

  @ApiProperty()
  icao: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city_code: string;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  utc: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}

@Entity('airports')
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cityCode: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  cityName: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  countryName: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  countryCode: string | null;
}

export class CreateAirportDto {
  code: string | null;
  name: string | null
  cityCode: string | null;
  cityName: string | null;
  countryName: string | null;
  countryCode: string | null;
}
