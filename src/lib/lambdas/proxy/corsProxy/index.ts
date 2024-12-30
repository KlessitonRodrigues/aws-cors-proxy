import * as http from 'http';

import { Lambdas } from '../../../../@types/lambdas';
import { createResponse } from '../../../../utils/api/createResponse';

export const handler: Lambdas.APIHandler = async event => {
  try {
    const url = event.queryStringParameters?.url;
    if (!url) throw new Error('Missing url parameter');

    const fetchHTML = (url: string) => {
      return new Promise<string>((resolve, reject) => {
        try {
          http.get(url, (res: any) => {
            let rawHtml = '';
            res.on('data', (chunk: any) => (rawHtml += chunk));
            res.on('end', () => resolve(rawHtml));
          });
        } catch (e) {
          reject(e);
        }
      });
    };

    const content = await fetchHTML(url);

    return createResponse(200, { content });
  } catch (err: any) {
    return createResponse(500, err.message);
  } finally {
  }
};
