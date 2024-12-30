# 🌐 CORS Proxy using AWS Lambda

#### 💡 How it works

- Blocked by CORS policy in a browser environment

  ```
  fetch("https://www.google.com")
  ```

- With CORS Proxy

  ```
  fetch("https://yomq4*****.execute-api.us-east-1.amazonaws.com/prod/proxy?url=https://www.google.com")
  ```

#### 🚀 Start Local Application

- run "yarn" and "yarn start"

#### 📦 Deploy Application to AWS

- Add AWS keys

  ```
  export AWS_ACCESS_KEY_ID=
  export AWS_SECRET_ACCESS_KEY=
  export AWS_DEFAULT_REGION=us-east-1
  ```

- Deploy

  ```
  yarn cdk:deploy
  ```
