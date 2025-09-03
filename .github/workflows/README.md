# GitHub Actions Workflows

This directory contains the CI/CD workflows for the WebSVF project.

## Workflows

### 3. `deploy.yml` - Deploy All Services
- **Trigger**: Push to `master` branch,
- **Purpose**: Combined workflow that deploys both frontend and API
- **Jobs**:
  - Frontend deployment to GitHub Pages
  - API deployment to Fly.io (if API directory exists)

### 4. `format.yml` - Lint and Format Check
- **Trigger**: Push or PR to `master` branch
- **Purpose**: Runs code quality checks
- **Checks**:
  - Prettier formatting (`npm run format:check`)
  - ESLint linting (`npm run lint`)
  - TypeScript type checking (`npm run type-check`)
  - Python linting with ruff and mypy (`ruff check .`, `mypy .`)
- **Node Version**: 18.x

## Required Secrets

For full functionality, configure these secrets in your repository settings:

- `FLY_API_TOKEN`: Authentication token for Fly.io deployment (only needed if deploying API)