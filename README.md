
# **<p align="center">SVF ANALYSIS TOOLS</p>**
## **Architecture**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/Architecture.png?raw=true' width='720'/>
The overall architecture for the WebSVF is composed of three major parts: The landing page, where users will be able to access their code spaces, ECS service in AWS where we run users codespaces as container which is pulled from docker hub and Docker Containers which is basically the WebSVF Backend.

Detailed explanation of the architecutre can be found [here](https://github.com/SVF-tools/WebSVF/wiki/Architecture)


## **Prerequisites**
1. **Git**
2. **[Node.JS](https://nodejs.org/en/download/)**
3. **Yarn** 
	- Install on [Ubuntu](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
	- Install on MacOS: `brew install yarn`
	- Download on [Windows](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
4. **[VSCode](https://code.visualstudio.com/)** OR **[Code-Server](https://github.com/cdr/code-server)**
5. **Docker**
    - Install on [Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
    - Install on [MacOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
    - Install on [Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)

## **Installation Guide** ##

### **Install from VScode extension market** ###
You can install the extension from VScode extension market dierctly.
Search "SVFTOOLS" in VScode extension market and install it.

<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/market.png?raw=true' width='720'/>


### **Building WebSVF Extension** ###
If you cannot find it in VScode market, you can build it by yourself.
To build WebSVF, you need to clone the source code repository and use VS Code Extension Manager to install the SVFTOOLS
```
# Clone from WebSVF repo
git clone https://github.com/SVF-tools/WebSVF --depth 1 

# Go to SVFTOOLS directory 
cd ./WebSVF/src/SVFTOOLS

# Install dependencies
yarn

# Install the Visual Studio Code Extension Manager
npm install -g vsce 

# Generate a .vsix file
vsce package 
```

### **Enable the SVFTOOLS extension** ###
This building process will output a **svftools-[version].vsix** file, which could be used to generate the extension. 
1. Click on the Extensions icon in the Activity Bar on the side of VS Code 
2. Click more to install extension from the generated .vsix file
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='720'/>

## ***User Guide** ##

### **Use SVFTOOLS extension** ###
After installed SVFTOOLS extension,
1. Click "INSTALL SVF ENVIRONMENT" to install the svf environment
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/envir_install.png?raw=true' width='720'/>
2. Click "BUILD INPUT TARGET" to generate a code sample for demonstration
3. Click button below to open the target file
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_input.png?raw=true' width='720'/>
4. Simply tap "TARGET REPORT" button to get the analysis report
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_report.png?raw=true' width='720'/>

### **WebSVF on the Cloud** ###

To get started with WebSVF, simply signup on our [website]( https://svf-tools.github.io/WebSVF/#/) and get a code space with all the required SVF tools preinstalled.

This feature is still on beta and you might face issues while using it.  We might already be aware about the issue and have started working on it. Please check our [known issues](#) section for further info

1. Click on Log in  which will take you to the Login/Signup Page
2. If you do not have an account with us, you can signup to get your own personalised code space with all the Web SVF tools pre-installed

If you want to run the WebApp locally, you will need to follow the [Guide](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Running-WebSVF-WebApp-locally) here.


## **Developer Guide** ##
### **[Local Development Web Server](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Local-Development-Web-Server)** ###
### **[AWS Setup Using ECS](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-AWS-Setup-Using-ECS)** ###
