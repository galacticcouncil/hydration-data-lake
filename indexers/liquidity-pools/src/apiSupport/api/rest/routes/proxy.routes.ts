import { Router } from 'express';
import { ProxyApiRoute } from '../proxyApiHandlers/types';
import { handleProxyReqSubscan } from '../proxyApiHandlers/resources/subscan';
import { handleProxyReqDefillama } from '../proxyApiHandlers/resources/defillama';
import { handleProxyReqKamino } from '../proxyApiHandlers/resources/kamino';
import { handleProxyReqSubsquare } from '../proxyApiHandlers/resources/subsquare';

const proxyRouter = Router();

proxyRouter.post(`${ProxyApiRoute.subscan}/*all`, handleProxyReqSubscan);
proxyRouter.get(`${ProxyApiRoute.defillama}/*all`, handleProxyReqDefillama);
proxyRouter.get(`${ProxyApiRoute.kamino}/*all`, handleProxyReqKamino);
proxyRouter.get(`${ProxyApiRoute.subsquare}/*all`, handleProxyReqSubsquare);

export default proxyRouter;
