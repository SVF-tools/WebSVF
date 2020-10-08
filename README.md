# **<p align="center">SVF ANALYSIS TOOLS</p>**

## **Install Guide**

### **AWS**

### **Docker**
- **Uninstall previous versions of Docker: `sudo apt-get remove docker docker-engine docker.io containerd runc`**
- **Install packages: `sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`**
- **Add Docker Official GPG key: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`**
- **Install Docker Engine: `sudo apt-get update sudo apt-get install docker-ce docker-ce-cli containerd.io`**
- **Verify Docker Engine is installed correctly: `sudo docker run hello-world`**
### **Local**
- **Step 1. Install development tools.**
    - **git**. **[The git download link](https://code.visualstudio.com/)**
    - **nodejs**. **[The nodejs download link](https://nodejs.org/zh-cn/download/)**
    - **yarn**. **[The yarn download link](https://classic.yarnpkg.com/en/docs/install/#windows-stable)**
    - **vscode**. **[The vscode download link](https://code.visualstudio.com/)**
- **Step 2. Prepare development environment.**
    - **cmd: `git clone https://github.com/SVF-tools/WebSVF.git --depth 1`**  
    - **cmd: `cd ./WebSVF/src/SVFTOOLS`**  
    - **cmd: `yarn`**  
    - **cmd: `code .`**  
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/env.gif?raw=true' width='720'/>

- **Step 3. Generate extension**
    - **keyboard (for open vscode terminal):**  
        - **Linux: [ Ctrl + shift + `]**  
        - **Mac: [ ^ + ⇧ + ` ]**
    - **cmd: `sudo npm install -g vsce`** 
    - **cmd: `vsce package`**  
It will generate a extension named: **svftools-[version].vsix**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsce.gif?raw=true' width='720'/>

- **To Compile:**   
    - **cmd: `yarn compile`**  
- **To Debug:**  
    - **keyboard: [ _F5_ ]**  

- **How to install extension ?**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='720'/>

### **User Guide**

### **Online**



### **Operation**

## **Dev Guide**
### **Multi-tenancy using Docker Container** ###
- **Currently it is recommended to download the docker image(https://hub.docker.com/r/winoooops/websvf-docker)**
- **(Optional)How to use Dockerfile on VM** 
    - **Build the image(cd to the root repo): `docker build -t websvf:0.4 .`**
- **Run Docker Container: `docker run -p 8080:8080 --name websvf websvf:0.4`**
- **Enable Dockerbuild automation with Git Push**
    - **bind DockerHub to GitHub repo(https://medium.com/better-programming/build-your-docker-images-automatically-when-you-push-on-github-18e80ece76af)**
    
