"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const ip_logger_middleware_1 = require("./ip-logger/ip-logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(new ip_logger_middleware_1.IpLoggerMiddleware().use);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Flight')
        .setDescription('Flight api description')
        .setVersion('2.0')
        .addTag('flight')
        .addSecurityRequirements('token')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
    }, 'access_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map