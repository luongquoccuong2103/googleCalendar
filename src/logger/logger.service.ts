import { Injectable, Scope } from '@nestjs/common';
import { gray, green, red, yellow } from 'colorette';
import * as fs from 'fs';
import { Logger, multistream, pino } from 'pino';
import { HttpLogger, pinoHttp } from 'pino-http';

import { ILoggerService } from './adapter';
import { LOG_LEVEL } from 'src/constants/logLevel';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILoggerService {
  pinoHttp: HttpLogger;
  private pinoLogger: Logger;
  private extraInfo: object = {};

  constructor() {
    Error.stackTraceLimit = 10;
    const dir = './logs';
    !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
    this.pinoLogger = pino(
      {
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        level: LOG_LEVEL.TRACE, // Set the lowest level of logs you want to capture
      },
      multistream([
        { stream: process.stdout },
        {
          stream: pino.destination(dir + '/info.log'),
          level: 'info',
        },
        {
          stream: pino.destination(dir + '/error.log'),
          level: 'error',
        },
        {
          stream: pino.destination(dir + '/debug.log'),
          level: 'debug',
        },
        {
          stream: pino.destination(dir + '/warn.log'),
          level: 'warn',
        },
        {
          stream: pino.destination(dir + '/fatal.log'),
          level: 'fatal',
        },
      ]),
    );

    console.log = (message, ...args) => this.pinoLogger.info(message, ...args);
    console.error = (message, ...args) =>
      this.pinoLogger.error(message, ...args);
    console.warn = (message, ...args) => this.pinoLogger.warn(message, ...args);
    console.debug = (message, ...args) =>
      this.pinoLogger.debug(message, ...args);

    this.pinoHttp = pinoHttp({
      logger: this.pinoLogger,
      base: {},
    });
  }

  setExtraInfo(infos): void {
    this.extraInfo = { ...this.extraInfo, ...infos };
    this.pinoHttp.logger = this.pinoHttp.logger.child(this.extraInfo);
  }

  log(message, context = {}): void {
    this.pinoHttp.logger.info(
      [context, green(message)].find(Boolean),
      green(message),
    );
  }

  trace(message, context = {}): void {
    this.pinoHttp.logger.trace(
      [context, gray(message)].find(Boolean),
      gray(message),
    );
  }

  info(message, context = {}): void {
    this.pinoHttp.logger.info(
      [context, green(message)].find(Boolean),
      green(message),
    );
  }

  warn(message, context = {}): void {
    this.pinoHttp.logger.warn(
      [context, yellow(message)].find(Boolean),
      yellow(message),
    );
  }
  error(message, context = {}): void {
    this.pinoHttp.logger.error(
      [context, red(message)].find(Boolean),
      red(message),
    );
  }
  fatal(message, context = {}): void {
    this.pinoHttp.logger.fatal(
      [context, red(message)].find(Boolean),
      red(message),
    );
  }
}
