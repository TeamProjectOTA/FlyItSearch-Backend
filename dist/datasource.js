"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Introduction_model_1 = require("./tour-package/entities/Introduction.model");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.FLYIT_URL,
    port: 3306,
    username: process.env.FLYIT_DB_USERNAME,
    password: process.env.FLYIT_DB_PASSWORD,
    database: process.env.FLYIT_DB_NAME,
    entities: [Introduction_model_1.Introduction],
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
    logging: true,
});
//# sourceMappingURL=datasource.js.map