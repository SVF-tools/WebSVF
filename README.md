
# **<p align="center">SVF ANALYSIS TOOLS</p>**

## Development Setup
Follow the [Development Setup](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Prerequisite) to prepare your local machine for WebSVF.

## **User Guide** ##

### **Building WebSVF Extension** ###
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

### **Use SVFTOOLS extension** ###
After installed SVFTOOLS extension,
1. Click "INSTALL SVF ENVIRONMENT" to install the svf environment
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/envir_install.png?raw=true' width='720'/>
2. Click button below to open the target file
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/target_input.png?raw=true' width='720'/>
3. Tap "TARGET REPORT" button to get the report
    <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/report.png?raw=true' width='720'/>

### **Installation Guide for Multi-User on Cloud** ###

To get started with WebSVF, simply signup on our [website]( https://svf-tools.github.io/WebSVF/#/) and get a code space with all the required SVF tools preinstalled.

This feature is still on beta and you might face issues while using it.  We might already be aware about the issue and have started working on it. Please check our [known issues](#) section for further info

1. Click on Log in  which will take you to the Login/Signup Page
2. If you do not have an account with us, you can signup to get your own personalised code space with all the Web SVF tools pre-installed

If you want to run the WebApp locally, you will need to follow the [Guide](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Running-WebSVF-WebApp-locally) here.


## **Developer Guide** ##
### **[Local Development Web Server](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-Local-Development-Web-Server)** ###
### **[AWS Setup Using ECS](https://github.com/SVF-tools/WebSVF/wiki/Developer-Guide-%7C%7C-AWS-Setup-Using-ECS)** ###
