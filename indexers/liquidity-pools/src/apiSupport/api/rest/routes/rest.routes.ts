import { Router } from 'express';
import mmReservesRouter from './mmReserves.routes';

const restRouter = Router();

restRouter.use('/mm-reserves', mmReservesRouter);

export default restRouter;
