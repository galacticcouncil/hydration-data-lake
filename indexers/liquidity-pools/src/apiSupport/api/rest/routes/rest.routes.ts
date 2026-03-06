import { Router } from 'express';
import mmReservesRouter from './mmReserves.routes';
import serviceRouter from './service.routes';

const restRouter = Router();

restRouter.use('/mm-reserves', mmReservesRouter);
restRouter.use('/service', serviceRouter);

export default restRouter;
