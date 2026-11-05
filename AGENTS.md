# Project Overview

AWS CORS Proxy - a serverless CORS proxy built with AWS Lambda and API Gateway, written in TypeScript. Proxies requests to external URLs to bypass browser CORS policy.

## Technologies

- **Runtime:** Node.js
- **Language:** TypeScript (~5.4.3), target ES2020, CommonJS modules
- **Infrastructure:** AWS CDK (2.137.0), `aws-cdk-lib`, `constructs`
- **AWS Services:** Lambda (NodeJS_18_X runtime), API Gateway (REST API)
- **Local Dev:** Express, body-parser, cors, nodemon, dotenv
- **Testing:** Jest, ts-jest
- **Docs:** redoc-cli, Swagger UI (GitHub Pages)
- **Formatting:** Prettier with `@trivago/prettier-plugin-sort-imports`

## Project Structure

```
aws-cors-proxy/
├── AGENTS.md
├── cdk.json              # CDK app entry: ts-node src/stacks/index.ts
├── package.json          # scripts, deps, jest config
├── tsconfig.json         # TS compiler options (rootDir: src, outDir: dist)
├── .prettierrc           # import order: src/*, server/*, [./]
├── .gitignore
├── swagger-2.0.yaml      # OpenAPI 2.0 spec for the API
├── docs/index.html       # Swagger UI docs (built by redoc-cli)
├── .github/
│   └── workflows/
│       └── swagger-pages.yml   # Deploys swagger docs to GitHub Pages on push to main
└── src/
    ├── @types/
    │   ├── lambdas.d.ts      # Lambdas namespace: APIHandler, LambdasProps, APIGatewayResponse
    │   └── models.d.ts       # Modules namespace (empty)
    ├── config/
    │   ├── dotenv.ts         # loads .env, exports env (AWS creds, region)
    │   └── localApi.ts       # Express app on :3005, /docs + /proxy routes
    ├── constants/
    │   └── codes.ts          # errorCodes enum (invalidReqBody, invalidParam, invalidDataseConnection)
    ├── lib/
    │   ├── gateway/
    │   │   └── apiRoot/
    │   │       └── index.ts    # APIRootGateway extends cdk.aws_apigateway.RestApi
    │   └── lambdas/
    │       └── proxy/
    │           └── corsProxy/
    │               ├── lambda.ts   # CorsProxy extends NodejsFunction (CDK construct)
    │               └── index.ts    # handler: fetches URL via https, returns createResponse(200, {content})
    ├── stacks/
    │   ├── index.ts          # CDK app entry, instantiates NodeTemplateStack
    │   └── NodeStack.ts      # NodeTemplateStack: Lambda + API Gateway /proxy GET + CORS preflight
    └── utils/
        └── api/
            ├── localApi.ts       # createLambdaEvent: adapts Express req/res to Lambda event
            ├── addCors.ts        # addCorsPreflight: adds CORS preflight to API Gateway resource
            └── createResponse.ts # createResponse(code, data): builds APIGatewayResponse
```

## Key Commands

| Command | Description |
|---------|-------------|
| `yarn` | Install dependencies |
| `yarn start` | Start local Express API (nodemon src/config/localApi.ts) on port 3005 |
| `yarn cdk:synt` | Synthesize CDK stack |
| `yarn cdk:deploy` | Deploy to AWS |
| `yarn test` | Run Jest tests |
| `yarn test-w` | Watch mode |
| `yarn test-cover` | Coverage report |
| `yarn format` | Prettier format check & write |
| `yarn build-docs` | Bundle redoc-cli to docs/index.html |

## Deployment

Set AWS credentials and region, then run `yarn cdk:deploy`:
```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
yarn cdk:deploy
```

## Notes

- Local API runs on port 3005 (see `localApi.ts`)
- Lambda handler is `src/lib/lambdas/proxy/corsProxy/index.ts` — accepts `url` query param, proxies via `https.get`
- API Gateway route: `GET /proxy`
- Type declarations live in `src/@types/`; `typeRoots` includes both `node_modules/@types` and `src/@types`
- Compiled output goes to `dist/` (gitignored via `*.js` except jest.config.js)
- CDK context in `cdk.json` enables many AWS construct feature flags