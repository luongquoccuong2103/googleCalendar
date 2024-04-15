import { HttpLogger } from 'pino-http';

export abstract class ILoggerService<T extends HttpLogger = HttpLogger> {
  abstract pinoHttp: T;
  abstract setExtraInfo(app: object): void;
  abstract log(message: string, context?: object): void;
  abstract trace(message: string, context?: object): void;
  abstract info(message: string, context?: object): void;
  abstract warn(message: string, context?: object): void;
  abstract error(message: string, context?: object): void;
  abstract fatal(message: string, context?: object): void;
}
