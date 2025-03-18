import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OnlyGraphqlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedPaths = [
      /\/graphql/,
      /\/queues[\/static\/.*]?/,
      /\/rest[\/v1\/.*]?/,
    ];
    for (const path of allowedPaths) {
      if (path.test(req.path)) {
        next();
        return;
      }
    }
    res.status(403).send('Access to this resource is forbidden.');
    return;
  }
}
