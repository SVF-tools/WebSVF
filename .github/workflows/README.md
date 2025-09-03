# GitHub Actions Workflows

This directory contains the CI/CD workflows for the WebSVF project.

## Workflows

### 1. `deploy.yml` - Deploy to GitHub Pages
- **Trigger**: Push to `master` or `main` branch
- **Purpose**: Builds and deploys the frontend application to GitHub Pages
- **Node Version**: 18.x
- **Output**: Deploys to `gh-pages` branch

### 2. `deploy-api.yml` - Deploy API to Fly.io
- **Trigger**: Push to `main` branch
- **Purpose**: Deploys the API backend to Fly.io
- **Requirements**: 
  - `FLY_API_TOKEN` secret must be configured
  - API code must be in the `api` directory
- **App Name**: `api-broken-moon-5814`

### 3. `deploy-all.yml` - Deploy All Services
- **Trigger**: Push to `main` or `master` branch, or manual trigger
- **Purpose**: Combined workflow that deploys both frontend and API
- **Jobs**:
  - Frontend deployment to GitHub Pages
  - API deployment to Fly.io (if API directory exists)

### 4. `format.yml` - Lint and Format Check
- **Trigger**: Push or PR to `main` or `master` branch
- **Purpose**: Runs code quality checks
- **Checks**:
  - Prettier formatting (`npm run format:check`)
  - ESLint linting (`npm run lint`)
  - TypeScript type checking (`npm run type-check`)
- **Node Version**: 18.x

## Required Secrets

For full functionality, configure these secrets in your repository settings:

- `FLY_API_TOKEN`: Authentication token for Fly.io deployment (only needed if deploying API)

## Manual Deployment

The `deploy-all.yml` workflow can be manually triggered from the Actions tab using the "workflow_dispatch" event.
