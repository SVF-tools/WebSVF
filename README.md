# WebSVF

## **Index**

1. **[Architecture Overview](#architecture-overview)**
1. **[Description](#description)**
1. **[Installation Guide](#installation-guide)**
1. **[User Guide](#user-guide)**
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



# Installation Guide

## Pre-Requisites

- **Ubuntu 18.04 or 20.04**: 
WebSVF-backend can only be used with Ubuntu 18.04 or 20.04.

- **[Node](https://nodejs.org/en/download/) >=v10.0**: 
To run the WebSVF-backend scripts, node version greater than 10.0 is required.

- **LLVM and Clang**: 
The LLVM and Clang compiler tools need to be installed and accessible from the terminal.

- **WLLVM**: 
For compiling entire projects into a LLVM Bitcode (.bc) file for analysis.

## System Requirements

- WebSVF requires atleast **6GB** free on your Ubuntu system to set up necessary dependecies.
- If you are running Ubuntu as a **Virtual Machine**, make sure there is atleast **15GB** free on the disk where the Virtual Machine is installed.

## **Installation**

Install the command-line tool globally on your system using npm, by running the following command:

```
sudo npm i -g @websvf/create-analysis
```

### ***(Optional) Setup Additional Project Dependencies (LLVM, Clang, Python, WLLVM)***

Skip this step if you already have the required dependencies.

```
sudo create-analysis --setup-env
```

**PLEASE NOTE:** A system RESTART is required for changes to take effect after running the above command

*This command also installs dependencies for the project demo.


### **1. Install WebSVF components**

```
sudo create-analysis -i
```

#### Options

##### **`-i`** or **`--install`** :

To install WebSVF and all its dependencies


### ***(Optional) Test the installation by creating analysis for a demo project***

```
create-analysis --setup-eg
```

If you run into errors, run the `sudo create-analysis --setup-env` command and restart your system to make sure all the dependencies for the demo are installed.

### **2. Generate Analysis for LLVM Bitcode (.bc) file**

Generate the bitcode file for your program or project then run the following command from the same directory as the .bc file or specify the directory of the .bc file.

```
create-analysis
```

#### Options

##### **`-d bc-file-directory`** or **`--dir bc-file-directory`** (Optional):

Where `-d` or `--dir` flags indicate that the user wants to provide a path for the directory/folder containing the LLVM Bitcode (.bc) files. The `-d` flag is used cannot be left empty, it must be provided with a directory or the command will fail. If no `-d` flag is specified then the path for the directory containg the .bc files is assumed to be the current working directory from the terminal.

**How to compile a C project or program to LLVM Bitcode (.bc)**: [Detecting memory leaks](https://github.com/SVF-tools/SVF/wiki/Detecting-memory-leaks) (Step 2)

### **3. Generate Analysis using Custom Backend**

Generate the bitcode file for your program or project then run the following command from the same directory as the .bc file or specify the directory of the .bc file.

```
create-analysis --custom-backend path-to-backend-executable
```

#### Options

##### **`--custom-backend path-to-backend-executable`**:

If you have developed a custom backend for detecting memory leaks using the [SVF library](https://github.com/SVF-tools/SVF-npm) and the [SVF Example](https://github.com/SVF-tools/SVF-example).

You can specify the path to that executable using the --custom-backend option so that your new backend is used for generating the Bug Report instead of the default SVF backend bundled with WebSVF.

##### **`-d bc-file-directory`** or **`--dir bc-file-directory`** (Optional):

Where `-d` or `--dir` flags indicate that the user wants to provide a path for the directory/folder containing the LLVM Bitcode (.bc) files. The `-d` flag is used cannot be left empty, it must be provided with a directory or the command will fail. If no `-d` flag is specified then the path for the directory containg the .bc files is assumed to be the current working directory from the terminal.


### **4. Uninstall WebSVF Extensions and Dependencies**

```
sudo create-analysis -u
```

### ***(Optional) Reset the LLVM and Clang environment***

If you want to reset the environment setup by the `sudo create-analysis --setup-env`, you can do so by running the following command:

```
sudo create-analysis --reset-env
```

The dependency tools installed for testing the demo project are left installed in the system. The installed tools are as follows (if you wish to uninstall them):
- libglib2.0-dev
- libncurses5
- libtool


# User Guide

## WebSVF-frontend: server and extension

- **Open Project Folder in VSCode and Run WebSVF-backend**

    Run WebSVF-backend in the current project folder opened in your VSCode application window.

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

# Known Issues

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

# Developer Notes

## Patch Notes

Please find the CHANGELOG **[here](https://github.com/SVF-tools/WebSVF/blob/master/CHANGELOG.md)**

# Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

- **[SVF](https://github.com/SVF-tools/SVF) :**

SVF is a static tool that enables scalable and precise interprocedural dependence analysis for C and C++ programs. SVF allows value-flow construction and pointer analysis to be performed iteratively, thereby providing increasingly improved precision for both.
