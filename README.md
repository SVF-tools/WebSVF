# WebSVF

This is the WebSVF repository that has all latest code for WebSVF 6.0, as well as legacy code for WebSVF 5.0.

## WebSVF 6.0

WebSVF 6.0 is now live.

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

#### Option 1: Local Installation

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
# Navigate to the api directory if it exists
cd api  # or create an api directory with the backend code
python3 -m pip install -r requirements.txt
```

3. **Run the backend server:**
```sh
python3 -m uvicorn app:app --host 0.0.0.0 --port 8080
```

#### Option 2: Docker (Recommended)

```sh
cd api
docker build -t svf-backend . && docker run svf-backend
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
# WebSVF 6.0 is accessible at http://localhost:5173/6.0
```

Production build:
```sh
npm run build
# The build output will be in the build/ directory
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

### API Key for CodeGPT (Optional)

If you want to use the CodeGPT feature, you'll need an OpenAI API key:

1. Create an account with OpenAI
2. Navigate to the API section
3. Generate an API key
4. Create a `.env` file in the root directory:
```
REACT_APP_OPENAI_API_KEY='YOUR_API_KEY'
```

## Deployment

### Frontend Deployment (GitHub Pages)

The frontend is configured for deployment to GitHub Pages. Push to the `main` or `master` branch to trigger automatic deployment via GitHub Actions.

### Backend Deployment (Fly.io)

The backend can be deployed to Fly.io. See `.github/workflows/deploy-api.yml` for the deployment configuration.

## Development Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run validate` - Run all checks (type-check, lint, format)

## Legacy Versions

For documentation on WebSVF 5.0, please refer to the sections below.

---

# Legacy Documentation

## WebSVF 5.0

For a quick introduction to the latest addition in WebSVF 4.0, the CodeGPT panel, please have a watch of this video:
https://www.youtube.com/watch?v=Gf6vAyzOlJ0
The new feature allows users to communicate with OpenAI's GPT 3.5-Turbo engine, and attach any of their files present on the site!

To see the new features of WebSVF 5.0, please have a watch of this video:

### WebSVF 5.0 Final Video

Full Video: https://youtu.be/EGwzPoHQUzM

Slides: https://www.canva.com/design/DAGVJAkBxYs/MSXLoiYFYhyO_qh1qxGCrA/edit?utm_content=DAGVJAkBxYs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

https://github.com/user-attachments/assets/86be6ae2-ee34-42c5-89d2-f73ca2fa4a3c

### Middle term video of WebSVF 5.0
Full Video: https://youtu.be/0xt0WGAFV5M

Slides: https://www.canva.com/design/DAGNPdIVvZE/CcezXWfi-C7VX7TTSFeaZA/edit?utm_content=DAGNPdIVvZE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

https://github.com/user-attachments/assets/f0e16e53-2d5a-4691-bb23-fb603b7ea9da

## User Guide
WebSVF 5.0 allows users to enter their C code and analyse it using SVF tools. Users can ask CodeGPT in a chat like manner for help in understanding the different graphs, LLVM IR and how to fix  bugs detected by SVF tools.

### Compile Options
Users can select compile options to run. These compile option flags will be added when compiling the code using clang.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/compileOptions.png)
### Selecting executable options
Users can select SVF executables to run their C code on.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/executables.png)
### Graph features
#### Display graphs
All graphs produced by the executables will show under the graphs section. Users can select the graph they want to view

#### Node background colours
Nodes in the graph will have a background colour if they have a corresponding line of code in the code editor. The background colour of the line of code and the corresponding node will be the same to help users identify correlations. 
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/nodeCodeHighlight.png)

#### Clicking on nodes
When user clicks on a node and the node has a corresponding line of code, it will set the line of code into view and set the text of the line of code to a red colour.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/codeSelectedThroughNode.png)
#### Reset Zoom
Users can click on the reset zoom button to set the zoom and view back to default settings.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/resetZoom.png)

#### Freely zoom and move
Users can freely move and zoom along the graph viewer.
### Terminal Output
#### Display terminal output of executables
The terminal output section display terminal out from all the executables

#### Shows compile error messages
If there are any compile errors or warnings, the executables will not run. It will return the error and warning messages which can be seen under terminal output. 
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/clangErrors.png)
### LLVMIR
The LLVMIR shows the LLVMIR generated by clang and used by the executables. It has syntax highlighting to help users discern functions, variables, if conditions, loops etc.

![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/LLVMSyntaxHighlighting.png)
### Code Editor
The code editor is a monacco code editor which is the same editor used in Visual Studio code.

#### Background colour line of code 
If a line of code has a corresponding node in the current selected graph, the line of code will have the same background colour as the corresponding node.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/nodeCodeHighlight.png)


#### Clicking on line of code graph interaction
When user clicks on line of code and line of code has a corresponding node on graph, it will change the text colour of the corresponding node on the graph to red. 
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/nodeSelectedThroughCode.png)

#### Display error messages and warning messages
If there are any error messages or warning messages from clang or the executables, it will display it on the corresponding line of code in the code editor. Users can identify these errors and warnings on the code editor by looking for red underlines to the the line of code similar to Visual studio code. 

#### AskCodeGPT Shortcut
If a line of code has a error or warning messages, users can hover and click on quick fix and then ask CodeGPT. This will make an automatic prompt to CodeGPT to help users understand the bug and how to fix it. The prompts made specific to the bug. That is, the prompt will specify to CodeGPT is the bug is a memory leak, buffer overflow or a clang compiler error. 
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/AskCodeGPT.png)
### CodeGPT
CodeGPT allows users to ask questions about the code, graphs, terminal output and LLVM IR in a chat like manner.

#### Categorised Prompts
Users can select ready made prompts based on the categories code, graphs, terminal output and LLVM IR. 
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/askCodeGPTCategorisedPrompts.png)

### Save and share sessions
Users can save and share their coding sessions on WebSVF by clicking on the share button and copying the generated link. The generated link will save the users compile options, executable options and C code. When the user enters the link, it will restore the saved configurations.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/shareableLink.png)

### Font Size
Users can change the font size in the code editor, terminal output and LLVMIR using the increment button or the dropdown menu.
![](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/fontSize.png)

### Light and Dark mode
Users can select light and dark mode using the toggle in the top right section.
![Dark Mode](https://github.com/joshua-sy/capstoneProject2024/blob/main/wikiImages/darkMode.png)



## Installation of webSVF 5.0
Note, webSVF 5.0 uses svf-ex executable from previous webSVF to create graphs. The executable can only run in x86 architecture (not arm64). Installation should be completed on linux for best results.

### Downloading dotnet 8 on Linux
Go to this website
```
https://dotnet.microsoft.com/en-us/download/dotnet/8.0
```

Download sdk for dotnet 8.0. Click on x64 for binaries if using x64 architecture. Click arm64 if running on M-series macbook. This should automatically download the binary as a tar file.
```
cd Downloads
```
Go into downloads and run the following commands. (These commands were taken from the download page)

```
mkdir -p $HOME/dotnet && tar zxf dotnet-sdk-8.0.402-linux-x64.tar.gz -C $HOME/dotnet
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

Run the 2 export commands every time you open up a new terminal session. You could also edit the your shell profile to permanently add the commands. 

### Downloading node manager for frontend

Install Node Version Manager (nvm) by running the following command
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

Install Node version 20 by running following command
```
nvm install 20
```

You can check the node version by running following command. It should say v20.*.*
```
node -v
```

### How to run frontend locally
Go into frontend folder
```
cd frontend
```
Install node packages needed to run frontend by using the following command.
```
npm install
```
Run npm run dev
```
npm run dev
```

### How to run backend locally
User needs to have dotnet 8 to run the backend locally.

Go into api folder
```
cd api
```

Run dotnet run
```
dotnet run
```


### Backend Deployment
WebSVF 5.0 is currently deployed using fly.io
1. Create an account using fly.io. Note, you may need to enter credit card details to use fly.io as it is a pay as you go service.

2. Install fly.io command line flyctl. Setup guide can be found here: https://fly.io/docs/flyctl/install/

3. Go into the api folder
```
cd api
```

4. Run the fly launch command line and specify the docker file path under the api folder. Fly.io will use the docker file to deploy and run the dotnet backend application. It should create a fly.toml file, a configuration file for fly.io. 

```
fly launch --dockerfile Dockerfile
```

5. Run fly deploy to deploy the application. Use the fly deploy command if you make changes to the backend or docker file so that these changes can be applied to the deployed application. 

```
fly deploy
```

### Frontend Deployment
Frontend is currently deployed using Vercel.
The frontend can be deployed using Vercel.

1. Create a Vercel account and link github account to Vercel. The github account should have the forked capstone project repo.

2. Click add new in the dashboard. Then click Project.

3. Under your github account, import the forked report.

4. You should now be under new project where you can configure settings before deployment.
      -  Set a project name (up to your choice)
      -  Set framework preset to Vite
      -  Set Root Directory to frontend
5. Click Deploy. Vercel should now start building website.

### API Key
If you want to change the API key for codeGPT or come across the error 'apiKey' does not exist.

Add the APIKey to a .env.sh file inside frontend folder and outside of src. Add the following to the env file.
```
VITE_OPENAI_API_KEY='YOUR_API_KEY'
```

To generate the API key, you will need to:
1. create an account with OpenAI.
2. After logging in, select 'API'.
3. Click on the GPT icon in the top left corner to expand the sidebar
4. Select API Keys. Here, you can generate a key and add it as the value to the apiKey variable.