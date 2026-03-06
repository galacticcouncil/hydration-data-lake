import { Router } from 'express';
import { getMetadata } from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.get(`/metadata`, getMetadata);

export default serviceRouter;
