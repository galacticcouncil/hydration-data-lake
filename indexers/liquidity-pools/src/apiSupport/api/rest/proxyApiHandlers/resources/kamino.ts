import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import {
  allowedQueriesDefillama,
  allowedQueriesKamino,
  allowedQueriesSubscan,
} from '../types';
import { AppConfig } from '../../../../../appConfig';
import crypto from 'node:crypto';
import { YieldMetricsInterval } from '../../../../types';
import { CacheManager } from '../../../../utils/cacheManager';
import { OmnipoolAssetsYieldMetricsResponse } from '../../../graphql/plugins/query/omnipool/omnipoolYieldMetrics/resolvers';

const appConfig = AppConfig.getInstance();

export async function handleProxyReqKamino(req: Request, res: Response) {
  try {
    const requestPath = req.params.all || [];
    const [apiName, section, query] = requestPath;

    if (!allowedQueriesKamino.has(apiName)) {
      return res.status(403).send('Forbidden');
    }

    // https: const reqUrl = `https://api.kamino.finance/yields/{yieldSource}/history`;
    const reqUrl = `https://api.kamino.finance/${apiName}/${section}/${query}`;

    return handleProxyReqKaminoAny(reqUrl, req, res);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).send(`Internal Proxy Error`);
  }
}

export async function handleProxyReqKaminoAny(
  reqUrl: string,
  req: Request,
  res: Response
) {
  try {
    const cacheKey = `PROXY_KAMINO::${crypto
      .createHash('md5')
      .update(req.url)
      .digest('hex')}`;

    const cachedData =
      await CacheManager.getInstance().cache.get<any>(cacheKey);

    if (cachedData) {
      res.status(200).send(cachedData);
      return;
    }

    const customHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const axiosConfig: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig['method'],
      url: reqUrl,
      headers: customHeaders,
      params: req.query,
      data: req.body,
    };

    const response = await axios(axiosConfig);

    await CacheManager.getInstance().cache.set<any>(
      cacheKey,
      response.data,
      10_800_000
    );

    res.status(response.status).send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res.status(error.response.status).send(error.response.data);
      }
      console.error('Axios Error:', error.message);
      return res.status(500).send('Proxy request failed');
    }

    console.error('Unexpected Error:', error);
    return res.status(500).send('Internal Proxy Error');
  }
}
