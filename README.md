# WebSVF 6.0

This is the WebSVF repository that has all latest code for WebSVF 6.0.

### Architecture
- Modern React-based frontend using Vite
- Python-based backend using FastAPI

### Features
- Support for multiple SVF analysis tools
- Real-time code analysis and graph visualization
- Dark/Light mode support
- Session management for saving and sharing work
- CodeGPT integration for AI-assisted learning

## Installation and Setup

### Prerequisites

Ensure you have the following installed on your machine:
- Clang
- Python 3.10+
- CMake 3.23+
- Node.js 20.x (via nvm recommended)

You can verify your installations:
```sh
python3 --version
cmake --version
clang --version
node -v
```

### Backend Setup

#### Option 1: Docker (Recommended)

```sh
cd api
docker build -t svf-backend . && docker run svf-backend
```

#### Option 2: Local Installation

1. **Install Python-SVF:**
```sh
git clone "https://github.com/SVF-tools/SVF-Python.git"
cd SVF-Python
bash ./build.sh

# You may also need to install Python Wheels
python3 -m pip install dist/*.whl
```

2. **Install backend dependencies:**
```sh
# Navigate to the api directory
cd api
python3 -m pip install -r requirements.txt
```

3. **Run the backend server:**
```sh
python3 -m uvicorn app:app --host 0.0.0.0 --port 8080
```

### Linting
To ensure code quality, run the following linting commands in the `api` directory:
```sh
# Install linting tools if not already 
cd api
python3 -m pip install ruff mypy
ruff check . --fix
mypy .
```

### Frontend Setup

1. **Install Node Version Manager (nvm):**
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

2. **Install Node.js 20:**
```sh
nvm install 20
nvm use 20
```

3. **Install dependencies:**
```sh
# From the WebSVF root directory
npm install
```

4. **Run the application:**

Development mode:
```sh
npm start
# The app will run on http://localhost:5173
```

Production build:
```sh
npm run build
# The build output will be in the dist/ directory
```

### Linting
You can run the following commands in the root directory.
```sh
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check

# Checks all of them together
npm run validate
```


## Configuration

### API Key for CodeGPT for Local Installation (Optional)

If you want to use the CodeGPT feature locally, you'll need an OpenAI API key:

1. Create an account with OpenAI
2. Navigate to the API section
3. Generate an API key
4. Create a `.env` file in the root directory:
```
VITE_OPENAI_API_KEY='YOUR_API_KEY'
```

## Deployment

The frontend and backend is configured for deployment to GitHub Pages and Fly.io. Push to the `master` branch to trigger automatic deployment via GitHub Actions. 
