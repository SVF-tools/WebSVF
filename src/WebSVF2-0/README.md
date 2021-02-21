# WebSVFExpress

Currently runs on PORT as defined in the .env file or `5001`.

If PORT isn't defined in .env, the server is accessible locally at http://localhost:5001

## Setup for `/analysis` routes

The `/analysis` routes work using SVF.
Ubuntu 18.04 is recommended for optimal use.
To setup LLVM, Clang and SVF run the following command to install them using [WebSVF-backend](https://www.npmjs.com/package/@websvf/create-analysis):

```
sudo npx @websvf/create-analysis --install-all
```

## Init App

```
yarn
```

## Start App

```
yarn start
```

Start app in development mode:

```
yarn dev
```
