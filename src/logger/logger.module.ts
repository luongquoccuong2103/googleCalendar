import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ILoggerService } from './adapter';

@Global()
@Module({
  providers: [
    {
      provide: ILoggerService,
      useFactory: () => {
        return new LoggerService();
      },
    },
    LoggerService,
  ],
  exports: [ILoggerService],
})
export class LoggerModule {}
