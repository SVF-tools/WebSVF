
# **<p align="center">SVF ANALYSIS TOOLS</p>**
## **1. Architecture**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/ArchitectureV3.png?raw=true' width='520'/>

* The overall architecture for the WebSVF is composed of following components:
	* **Landing Page**: Users will be able to view their codespace on the landing page. Landing page is hosted on github pages.It integrates with Firebase for authentication and storage as well as communicates with AWS for codespaces
	* **Cloud (AWS)**: ECS service on AWS is used to host WebSVF Docker containers. Docker containers run as tasks on ECS. 
	* **Docker Container**: Code-Server runs on the container with all the WebSVF extension preinstalled
	* **WebSVF Extensions**: There are 4 extensions that come preinstalled. These extensions help build user's input code and backend code which is used to generate the bug report for code analysis

* Detailed explanation of the architecutre can be found [here](https://github.com/SVF-tools/WebSVF/wiki/Architecture)


## **2. Prerequisites**
1. **Docker**
    - Install on [Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
    - Install on [MacOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
    - Install on [Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)
2. **Git (if not using dockerhub)**

## **3. Installation Guide** ##

### **3.1 Install WebSVF using Docker Image (recommended)** ###
To debug code and run tests, it is often useful to have a local HTTP server. For the purpose of further deploying the project on AWS, we have made available a local web server with a dockerized code-server.
*To install WebSVF using docker, ensure you have docker installed as per our prerequisite*

1. Download image  
`docker pull websvf/websvf` 
2. Run a server  
`docker run -itd -p 127.0.0.1:9000:9000 --name websvf websvf/websvf`
3. Browser enter  
`http://127.0.0.1:9000`

## **4. User Guide** ##

### **4.1 Use SVFTOOLS extension** ###
1. Click "BUILD INPUT TARGET" to generate a code sample for demonstration
2. Click button below to open the target file
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_input.png?raw=true' width='720'/>
3. Simply tap "TARGET REPORT" button to get the analysis report
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_report.png?raw=true' width='720'/>

### **4.2 WebSVF on the Cloud** ###

To get started with WebSVF, simply signup on our [website]( https://svf-tools.github.io/WebSVF/#/) and get a code space with all the required SVF tools preinstalled.

This feature is still on beta and you might face issues while using it.  We might already be aware about the issue and have started working on it. Please check our [known issues](#) section for further info

1. Click on Log in  which will take you to the Login/Signup Page
2. If you do not have an account with us, you can signup to get your own personalised code space with all the Web SVF tools pre-installed

If you want to run the WebApp locally, you will need to follow the [Guide](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Running-WebSVF-WebApp-locally) here.


## **5. Developer Guide** ##
### **[AWS Setup Using ECS](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-AWS-Setup-Using-ECS)** ###
