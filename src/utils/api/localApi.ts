import { Request, Response } from 'express';

import { Lambdas } from '../../@types/lambdas';

export const createLambdaEvent = (lambda: Lambdas.APIHandler) => (req: Request, res: Response) => {
  lambda({
    resource: req.path,
    path: req.path,
    httpMethod: req.method,
    queryStringParameters: req.query,
    multiValueQueryStringParameters: req.query,
    pathParameters: req.params,
    headers: {
      Authorization: req.headers.authorization,
    },
    stageVariables: {},
    body: JSON.stringify(req.body),
    isBase64Encoded: false,
  })
    .then(response => {
      res
        .status(response.statusCode)
        .setHeader('Content-Type', 'application/json')
        .send(response.body);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};
