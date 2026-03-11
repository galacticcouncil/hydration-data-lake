import { Router } from 'express';
import {
  getHealthStatus,
  getMetadata,
} from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.get(`/metadata`, getMetadata);
serviceRouter.get(`/health`, getHealthStatus);

export default serviceRouter;
