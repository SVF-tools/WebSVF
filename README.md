
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


## **Developer Guide** ##

