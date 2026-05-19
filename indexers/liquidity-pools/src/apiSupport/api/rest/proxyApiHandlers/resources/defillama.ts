import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { allowedQueriesDefillama, allowedQueriesSubscan } from '../types';
import { AppConfig } from '../../../../../appConfig';
import crypto from 'node:crypto';
import { YieldMetricsInterval } from '../../../../types';
import { CacheManager } from '../../../../utils/cacheManager';
import { OmnipoolAssetsYieldMetricsResponse } from '../../../graphql/plugins/query/omnipool/omnipoolYieldMetrics/resolvers';

const appConfig = AppConfig.getInstance();

export async function handleProxyReqDefillama(req: Request, res: Response) {
  try {
    const requestPath = req.params.all || [];
    const [apiName, section, query] = requestPath;

    if (
      !allowedQueriesDefillama.has(apiName) ||
      !allowedQueriesDefillama.get(apiName)!.has(section)
    ) {
      return res.status(403).send('Forbidden');
    }

    const reqUrl = `https://${apiName}.llama.fi/${section}/${query}`;

    return handleProxyReqDefillamaAny(reqUrl, req, res);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).send(`Internal Proxy Error`);
  }
}

export async function handleProxyReqDefillamaAny(
  reqUrl: string,
  req: Request,
  res: Response
) {
  try {
    const cacheKey = `PROXY_DEFILLAMA::${crypto
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
      appConfig.API_PROXY_CACHE_TTL_MS_DEFILLAMA
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
