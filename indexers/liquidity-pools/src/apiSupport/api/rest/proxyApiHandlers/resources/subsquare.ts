import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { allowedQueriesSubsquare } from '../types';
import crypto from 'node:crypto';
import { CacheManager } from '../../../../utils/cacheManager';

export async function handleProxyReqSubsquare(req: Request, res: Response) {
  try {
    const requestPath = req.params.all || [];
    const [usersRoute, userAddress, apiName, section] = requestPath;

    if (
      !allowedQueriesSubsquare.has(apiName) ||
      !allowedQueriesSubsquare.get(apiName)!.has(section)
    ) {
      return res.status(403).send('Forbidden');
    }

    // https://hydration-api.subsquare.io/users/<address>/referenda/votes?page=1&page_size=25&includes_title=1
    const reqUrl = `https://hydration-api.subsquare.io/users/${userAddress}/${apiName}/${section}`;

    return handleProxyReqSubsquareAny(reqUrl, req, res);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).send(`Internal Proxy Error`);
  }
}

export async function handleProxyReqSubsquareAny(
  reqUrl: string,
  req: Request,
  res: Response
) {
  try {
    const cacheKey = `PROXY_SUBSQUARE::${crypto
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
