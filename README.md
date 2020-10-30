
# **<p align="center">SVF ANALYSIS TOOLS</p>**
## **1. Architecture**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/ArchitectureV2.png?raw=true' width='720'/>

* The overall architecture for the WebSVF is composed of following components:
	* **Landing Page**: Users will be able to view their codespace on the landing page. Landing page is hosted on github pages.It integrates with Firebase for authentication and storage as well as communicates with AWS for codespaces
	* **Cloud (AWS)**: ECS service on AWS is used to host WebSVF Docker containers. Docker containers run as task on ECS. 
	* **Docker Container**: Code-Server runs on the container with all the WebSVF extension preinstalled
	* **WebSVF Extensions**: There are 4 extensions that come preinstalled. These extension helps create build user's input code and backend code which is used to generate the bug report for code analysis

* Detailed explanation of the architecutre can be found [here](https://github.com/SVF-tools/WebSVF/wiki/Architecture)


## **2. Prerequisites**
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

## **3. Installation Guide** ##

### **Installing WebSVF using docker image (recommended)**
* To install WebSVF using docker, ensure you have docker installed as per our prerequisite
* Run `docker container run -d -p 8080:8080 --name websvf winoooops/websvf-docker`. This will run WebSVF on port 8080 of your device and will name the container "websvf"

> Otherways to install WebSVF locally can be found [here](https://github.com/SVF-tools/WebSVF/wiki/Installing-WebSVF)


## **4. User Guide** ##

### **4.1 Use SVFTOOLS extension** ###
After installed SVFTOOLS extension,
1. Click "INSTALL SVF ENVIRONMENT" to install the svf environment
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/envir_install.png?raw=true' width='720'/>
2. Click "BUILD INPUT TARGET" to generate a code sample for demonstration
3. Click button below to open the target file
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_input.png?raw=true' width='720'/>
4. Simply tap "TARGET REPORT" button to get the analysis report
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_report.png?raw=true' width='720'/>

### **4.2 WebSVF on the Cloud** ###

To get started with WebSVF, simply signup on our [website]( https://svf-tools.github.io/WebSVF/#/) and get a code space with all the required SVF tools preinstalled.

This feature is still on beta and you might face issues while using it.  We might already be aware about the issue and have started working on it. Please check our [known issues](#) section for further info

1. Click on Log in  which will take you to the Login/Signup Page
2. If you do not have an account with us, you can signup to get your own personalised code space with all the Web SVF tools pre-installed

If you want to run the WebApp locally, you will need to follow the [Guide](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Running-WebSVF-WebApp-locally) here.


## **5. Developer Guide** ##
### **[Local Development Web Server](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Local-Development-Web-Server)** ###
### **[AWS Setup Using ECS](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-AWS-Setup-Using-ECS)** ###
