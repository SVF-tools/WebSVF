
# **<p align="center">SVF ANALYSIS TOOLS</p>**

## Development Setup
Follow the [Development Setup](https://github.com/SVF-tools/WebSVF/wiki/Development-Setup) to prepare your local machine for WebSVF.


## Extension Installation 
1. `cd ./WebSVF/src/SVFTOOLS` to go to SVFTOOLs root 
2. `yarn` to install the website's npm dependencies
3. `sudo npm install -g vsce` to install the Visual Studio Code Extension Manager
4. `vsce package` to generate a .vsix file
5. Click on the Extensions icon in the Activity Bar on the side of VS Code, then click more to install extension from .vsix file
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='720'/>


## **User Guide**

1. **Running Single-User WebSVF locally**   
    - First, pull the image from Docker hub: ` sudo docker pull winoooops/websvf-docker `   
    - After Terminal finishes downloading, check the image has been successfully downloaded:` sudo docker images -a `. You should see a list of images and one of them is winoooops/websvf-docker.
    - Now try run the Docker Container: ` sudo docker run -p 8080:8080 --name websvf winoooops/websvf-docker ` This comand will trigger the code server to first install the extension and then listen on `0.0.0.0:8080` without requiring password. It will take a coule of seconds for the browser to finish the buffering. 


2. **AWS Multi-User Code Space**


## **Dev Guide**

### **How to use the DockerFile && Docker Hub Repository**
-  **Build from DockerFile**
   - In the root repo: `sudo docker build -t websvf:0.4 .`
   - After the image is built (usually takes 20-30mins), go check if the image's created: `sudo docker images -a`
   - Try testing the local image by creating a new container：`sudo docker run -p 8080:8080 --name websvf-local websvf:0.4`
   - Open `0.0.0.0:8080` to see if the container is valid 
-  **Using Docker Hub**
   - pull image from docker hub: `sudo docker pull winoooops/websvf-docker`
   - After the image download had finished, go check if the image's exist: `sudo docker images -a`
   - Try testing the local image by creating a new container：`sudo docker run -p 8080:8080 --name websvf-local winoooops/websvf-docker`
   - Open `0.0.0.0:8080` to see if the container is valid 
