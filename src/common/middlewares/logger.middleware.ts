import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();

    res.on('finish', () => {
      Logger.log(
        `[${req.method}] [${req.originalUrl}] [${res.statusCode}] [${
          Date.now() - now
        }ms]`,
        LoggerMiddleware.name
      );
    });

    next();
  }
}
