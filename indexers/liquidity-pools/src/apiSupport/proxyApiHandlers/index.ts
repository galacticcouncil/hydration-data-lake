import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { allowedQueries } from './types';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export async function handleProxyReqSubscan(req: Request, res: Response) {
  try {
    const requestPath = req.params.all || [];
    const [network, section, query] = requestPath;

    if (
      !allowedQueries.has(network) ||
      !allowedQueries.get(network)!.has(section) ||
      !allowedQueries.get(network)!.get(section)!.has(query)
    ) {
      return res.status(403).send('Forbidden');
    }

    const reqUrl = `https://${network}.api.subscan.io/api/scan/${section}/${query}`;

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

    const axiosConfig: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig['method'],
      url: reqUrl,
      headers: customHeaders,
      params: req.query,
      data: req.body,
    };

    const response = await axios(axiosConfig);

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
