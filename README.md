# WebSVF

## **Index** 

1. **[Architecture Overview](#architecture-overview)**
1. **[Description](#description)**
1. **[Installation (Local)](#installation-local)**
1. **[Installation (Cloud)](#installation-cloud)**
1. **[User Guide](#user-guide)**
1. **[Testing](#testing)**
1. **[Known Issues](#known-issues)**
1. **[Developer Notes](#developer-notes)**
1. **[Acknowledgement](#acknowledgement)**

# Architecture Overview

<img src="docs/WebSVF Architecture.jpg">

# Description

The Web-SVF, Bug Analysis Tool is comprised of 4 main components:


- **[WebSVF-backend](/src/WebSVF-backend) :**

This is a simple NodeJS CLI tool to easily install ***[WebSVF](https://github.com/SVF-tools/WebSVF)*** and run it.

- **[WebSVF-codemap-extension](/src/codemap_extension/) :**

This VSCode Extension could use 3D force graph to present bug information. Vsix file need to create by user self. Please follow the user guide link to install. This extension needs to be used when there is a network.

- **[WebSVF-frontend-server](/src/WebSVF-frontend-server) :**

NodeJS based Web-Server that is responsible for Front-End output of the *Bug Analysis* Tool. It is deployed automatically by the **WebSVF-frontend-extension** (Please refer to the **[WebSVF-frontend-extension](/src/WebSVF-frontend-extension)** for instructions regarding its deployment).

- **[WebSVF-frontend-extension](/src/WebSVF-frontend-extension) :**

This VSCode Extension serves as a wrapper for the NodeJS based Front-End for the *Bug Analysis* tool, **[WebSVF-frontend-server](https://github.com/SVF-tools/WebSVF/tree/master/src/WebSVF-frontend-server)**.



# Setup Guide

## Pre-Requisites

- **Ubuntu 18.04 or 20.04**: 
WebSVF-backend can only be used with Ubuntu 18.04 or 20.04.

- **[Node](https://nodejs.org/en/download/) >=v10.0**: 
To run the WebSVF-backend scripts, node version greater than 10.0 is required.
For Ubuntu 18.04, the default NodeJS version is <10.0, please add the NodeJS 10.0 repository first [using curl](https://joshtronic.com/2018/05/08/how-to-install-nodejs-10-on-ubuntu-1804-lts/).

- **LLVM and Clang**: 
The LLVM and Clang compiler tools need to be installed and accessible from the terminal.

- **WLLVM**: 
For compiling entire projects into a LLVM Bitcode (.bc) file for analysis.

- **[Code-Server](https://github.com/cdr/code-server) [for cloud install]**:
Run VS Code on any machine anywhere and access it in the browser.

## System Requirements

- WebSVF requires atleast **6GB** free on your Ubuntu system to set up necessary dependecies.
- If you are running Ubuntu as a **Virtual Machine**, make sure there is atleast **15GB** free on the disk where the Virtual Machine is installed.

## **Installation (Local)**

Install the command-line tool globally on your system using npm, by running the following command:

```
sudo npm i -g @websvf/create-analysis
```

### ***Setup Additional Project Dependencies (LLVM, Clang, Python, WLLVM)***

```
sudo create-analysis --setup-env
```
Installs LLVM-Clang 10 in the ***~/llvm-clang/10/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04*** directory.

*This command also installs dependencies for the project demo.

### **Install WebSVF components**

```
sudo create-analysis -i
```

## **Installation (Cloud)**

### **Setup a Cloud Server using code-server**

Please follow the Wiki to setup a Cloud Server with code-server setup on it: **[Deploy CodeServer on AWS](https://github.com/SVF-tools/WebSVF/wiki/Deploy-CodeServer-on-AWS)**

### **Install WebSVF-backend (Command Line Tool)**

Install the command-line tool globally using npm, by running the following command:

```
sudo npm i -g @websvf/create-analysis
```

### ***Setup Additional Project Dependencies (LLVM, Clang, Python, WLLVM)***

```
sudo create-analysis --setup-env
```
Installs LLVM-Clang 10 in the ***~/llvm-clang/10/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04*** directory.

*This command also installs dependencies for the project demo.


### **Install WebSVF**

```
sudo create-analysis --cloud-install
```
Refresh the webpage to see the extensions.

# User Guide

## WebSVF-frontend: server and extension

- **Open Project Folder in VSCode and Run WebSVF-backend**

    Generate the ***Bug-Analysis-Report.json*** in the current project folder opened in your VSCode application window by using WebSVF-backend.
    To create the ***Bug-Analysis-Report.json*** using WebSVF-backend:
    - Compile your C/C++ project
    - Generate a LLVM Bitcode file (.bc) for your compiled C program/project using Clang or WLLVM [**How to compile a C project or program to LLVM Bitcode (.bc)**: [Detecting memory leaks](https://github.com/SVF-tools/SVF/wiki/Detecting-memory-leaks) (Step 2)]
    - With the .bc file from your program/project present in the root of the folder opened in the VSCode window, run the `create-analysis` command from the terminal to generate the ***Bug-Analysis-Report.json*** file (with VSCode workspace directory as the current working directory in the terminal)
    

- **Initialise the '*WebSVF-frontend*' VSCode Extension**

    Install WebSVF-frontend-server by clicking on the ***'Bug Analysis Tool' button*** in the bottom left corner of your VSCode             application window (provided by the '*WebSVF-frontend*' VSCode Extension). Wait till the button reads: ***'Bug Analysis Tool:           Initialized'***

- **View the Bug Analysis for the Project**

    View the Bug Analysis for the Project by clicking on the ***'Bug Analysis Tool: Initialized' button***. The button text will turn red and the button will read ***'Bug Analysis Tool: Running'***. 
    (Please refer to the [Extension's Operation Guide](/src/WebSVF-frontend-extension/README.md#Extension-Operation-Guide) for more          information)

## WebSVF-codemap-extension

- **Installed situation**
[vsix file download page](https://github.com/SVF-tools/WebSVF/releases/tag/0.0.1)  
  <img src='https://github.com/codemapweb/codemap_extension/blob/master/images/after_install.png' width='480'/>

  After 30 seconds installation, you can see the 3D CODE MAP logo at below left.
- **Follow [User Instructions](./src/codemap_extension/README.md)**  
  <img src='https://github.com/codemapweb/codemap_extension/blob/master/images/7.gif' width='480'/>
  
  Please follow the **[User Instructions](./src/codemap_extension/README.md)** to use it.

# Testing

- ### [Test WebSVF-frontend locally](https://github.com/SVF-tools/WebSVF/wiki/Test-WebSVF-frontend-locally)

- ### [Test WebSVF-frontend on Cloud](https://github.com/SVF-tools/WebSVF/wiki/Test-WebSVF-frontend-on-Cloud)

# Known Issues

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

# Developer Notes

- ### Environment setup by the `create-analysis -i` or the `create-analysis --cloud-install` command
    If you followed the steps to install WebSVF using the WebSVF-backend. You will find a directory called svf in your home directory (_~/svf_). This directory contains 3      components:
    - _**svf-ex**_ binary/executable (_~/svf/svf-ex_), built using the unmodified [SVF-example](https://github.com/SVF-tools/SVF-example)
    - A directory called **_svf-lib_** (_~/svf/svf-lib/_) which contains the [SVF](https://github.com/SVF-tools/SVF) library for static code analysis, which can be used to build custom code analysis programs like [SVF-example](https://github.com/SVF-tools/SVF-example), which used this library by specifying the path to this directory in the SVF_DIR environment variable (-DSVF_DIR=path_to_svf-lib_directory).
    - A directory called _**SVF-example**_ (_~/svf/SVF-example/_) which is cloned from the GitHub Repository [SVF-example](https://github.com/SVF-tools/SVF-example). Using the SVF-example code as a template, you can create your own customized static analysis program to replace the _svf-ex_ binary/executable used by WebSVF to perform its backend analysis

- ### [Build your own SVF backend for WebSVF](https://github.com/SVF-tools/WebSVF/wiki/Build-your-own-SVF-backend-for-WebSVF)

## Patch Notes

Please find the CHANGELOG **[here](https://github.com/SVF-tools/WebSVF/blob/master/CHANGELOG.md)**

# Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

- **[SVF](https://github.com/SVF-tools/SVF) :**

SVF is a static tool that enables scalable and precise interprocedural dependence analysis for C and C++ programs. SVF allows value-flow construction and pointer analysis to be performed iteratively, thereby providing increasingly improved precision for both.
