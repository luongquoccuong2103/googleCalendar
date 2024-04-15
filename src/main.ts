import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ILoggerService } from './logger/adapter';
import { LoggerService } from './logger/logger.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(ILoggerService));
  const logger = new LoggerService();
  await app.listen(3000);
  logger.info(`🚀🚀🚀 App service running on port 3000`);
}
bootstrap();
