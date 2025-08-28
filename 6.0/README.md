# Running the Backend
Ensure you have atleast Clang, Python 3.10 and CMake 3.23 installed on your machine. You can check this by running the following command in your terminal:
```sh
python3 --version
cmake --version
clang --version
```
Download Python-SVF:
```sh
git clone "https://github.com/SVF-tools/SVF-Python.git"
cd SVF-Python
bash ./build.sh

# You may also need to install Python Wheels
python3 -m pip install dist/*.whl
```

Download required dependencies:
```sh
# /path/to/CapStoneWebSVF6.0/api
python3 -m pip install -r requirements.txt`
```
Finally, you can run the backend using the following command:
```sh
python3 -m uvicorn app:app --host 0.0.0.0 --port 8080

# Alternatively, you can run the backend using Docker (easy way)
docker build -t svf-backend . && docker run svf-backend
```

# Downloading node manager for frontend

Install Node Version Manager (nvm) by running the following command
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

Install Node version 20 by running following command
```sh
nvm install 20
```

You can check the node version by running following command. It should say v20.*.*
```sh
node -v
```

# How to run frontend

```sh
cd frontend

# Download the required dependencies:
npm install

# Run in development mode
npm run dev

# Run in production mode
npm run build
npm run preview
```

# Contributors
Sanjana Dinesh <br />
Joshua Sy <br />
Samiksha Anirudh <br />
Joshua Wills <br />
Christian Tolentino <br />
Aditi Sachan <br />
