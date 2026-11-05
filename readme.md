# 🌐 AWS CORS Proxy

A serverless CORS proxy built with AWS Lambda and API Gateway (REST API), written in TypeScript. Proxies requests to external URLs so browser clients can bypass CORS restrictions.

## 💡 How it works

Direct cross-origin fetch from the browser is blocked by CORS policy:

```ts
fetch("https://www.google.com") // ❌ Blocked by CORS
```

Route the request through the proxy instead:

```ts
fetch("https://<api-id>.execute-api.<region>.amazonaws.com/prod/proxy?url=https://www.google.com") // ✅ Works
```

The Lambda accepts a `url` query parameter, fetches the target URL server-side, and returns the response body with CORS headers.

## 🛠 Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript (~5.4.3), CommonJS |
| Infrastructure | AWS CDK (2.137.0), `aws-cdk-lib`, `constructs` |
| AWS services | Lambda (NodeJS_18_X), API Gateway REST API |
| Local dev | Express, body-parser, cors, nodemon, dotenv |
| Testing | Jest, ts-jest |
| Docs | redoc-cli, Swagger UI (GitHub Pages) |
| Formatting | Prettier (`@trivago/prettier-plugin-sort-imports`) |

## 📁 Project structure

```
aws-cors-proxy/
├── AGENTS.md
├── cdk.json              # CDK app entry: ts-node src/stacks/index.ts
├── package.json          # scripts, deps, jest config
├── tsconfig.json         # TS compiler options (rootDir: src, outDir: dist)
├── .prettierrc           # import order: src/*, server/*, [./]
├── .gitignore
├── swagger-2.0.yaml      # OpenAPI 2.0 spec for the API
├── docs/index.html       # Swagger UI docs
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
    │   └── codes.ts          # errorCodes enum
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

## 🚀 Get started

### Install dependencies

```bash
yarn
```

### Run locally

Starts an Express server on `http://localhost:3005` with `/proxy` and `/docs` routes:

```bash
yarn start
```

Example local request:

```bash
curl "http://localhost:3005/proxy?url=https://www.google.com"
```

## 📦 Deploy to AWS

Set AWS credentials and region:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

Synthesize (optional):

```bash
yarn cdk:synt
```

Deploy:

```bash
yarn cdk:deploy
```

The stack creates a `CorsProxyAPI` API Gateway REST API with a `GET /proxy` endpoint backed by the `CorsProxyLambda` Lambda function and CORS preflight enabled.

## 📡 API

### `GET /proxy`

| Query param | Required | Description |
|-------------|----------|-------------|
| `url` | Yes | Target URL to proxy |

Example:

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/proxy?url=https://example.com"
```

Response (JSON):

```json
{
  "content": "<html>...</html>"
}
```

The response includes `Access-Control-Allow-Origin: *` and other CORS headers.

## 🧪 Testing

```bash
yarn test          # Run Jest tests
yarn test-w        # Watch mode
yarn test-cover    # Coverage report
```

## 🎨 Formatting

```bash
yarn format        # Prettier check & write
```

## 📄 Documentation

Build Swagger UI docs:

```bash
yarn build-docs
```

Docs are published to GitHub Pages via `.github/workflows/swagger-pages.yml` on push to `main`.

## 📝 Notes

- Local API runs on port `3005` (see `src/config/localApi.ts`)
- Lambda handler: `src/lib/lambdas/proxy/corsProxy/index.ts` — accepts `url` query param, proxies via `https.get`
- API Gateway route: `GET /proxy`
- Type declarations live in `src/@types/`; `typeRoots` includes both `node_modules/@types` and `src/@types`
- Compiled output goes to `dist/` (gitignored via `*.js` except `jest.config.js`)
- CDK context in `cdk.json` enables many AWS construct feature flags
