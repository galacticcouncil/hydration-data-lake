import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { allowedQueriesSubscan } from '../types';
import { AppConfig } from '../../../../../appConfig';
import crypto from 'node:crypto';
import { CacheManager } from '../../../../utils/cacheManager';

const appConfig = AppConfig.getInstance();

export async function handleProxyReqSubscan(req: Request, res: Response) {
  try {
    const requestPath = req.params.all || [];
    const [network, section, query = '##none##'] = requestPath;

    if (
      !allowedQueriesSubscan.has(network) ||
      !allowedQueriesSubscan.get(network)!.has(section)
      // !allowedQueriesSubscan.get(network)!.get(section)!.has(query)
    ) {
      return res.status(403).send('Forbidden');
    }

    const reqUrl = `https://${network}.api.subscan.io/api/scan/${section}${query === '##none##' ? '' : `/${query}`}`;

    return handleProxyReqSubscanAny(reqUrl, req, res);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).send(`Internal Proxy Error`);
  }
}

export async function handleProxyReqSubscanAny(
  reqUrl: string,
  req: Request,
  res: Response
) {
  try {
    const customHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': appConfig.SUBSCAN_PRO_API_SECRET,
    };
    const allExistingHeaders = req.headers;
    const isCacheRequested = allExistingHeaders['x-custom-cache-on'] === 'true';

    const cacheKey = `PROXY_SUBSCAN::${crypto
      .createHash('md5')
      .update(req.url)
      .digest('hex')}`;

    if (isCacheRequested) {
      const cachedData =
        await CacheManager.getInstance().cache.get<any>(cacheKey);

      if (cachedData) {
        res.status(200).send(cachedData);
        return;
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig['method'],
      url: reqUrl,
      headers: customHeaders,
      params: req.query,
      data: req.body,
    };

    const response = await axios(axiosConfig);

    if (isCacheRequested) {
      await CacheManager.getInstance().cache.set<any>(
        cacheKey,
        response.data,
        appConfig.API_PROXY_CACHE_TTL_MS_SUBSCAN
      );
    }

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
