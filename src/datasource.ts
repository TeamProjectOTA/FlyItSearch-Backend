import { DataSource } from 'typeorm';
import { Introduction } from './tour-package/entities/Introduction.model';




export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.FLYIT_URL,
  port: 3306,
  username: process.env.FLYIT_DB_USERNAME,
  password: process.env.FLYIT_DB_PASSWORD,
  database: process.env.FLYIT_DB_NAME,
  entities: [Introduction],  // Explicitly add your entities
  synchronize: false,  // Set synchronize to false to prevent auto sync
  migrations: ['src/migrations/*.ts'],  // Path to migrations
  logging: true,
});
