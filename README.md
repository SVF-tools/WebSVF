# WebSVF

## **Index**

1. **[Architecture Overview](#architecture-overview)**
1. **[Description](#description)**
1. **[Installation Guide](#installation-guide)**
1. **[Uninstall](#uninstalling-websvf-extensions-and-dependencies-svf-llvm-clang)**
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

- WebSVF is only tested and targetted for **Ubuntu 20.04** (Not compatible with versions of Ubuntu older than 19.10)
- Installation of **NodeJS v10.0 or later**

## System Requirements

- WebSVF requires atleast **6GB** free on your Ubuntu system to set up necessary dependecies.
- If you are running Ubuntu as a **Virtual Machine**, make sure there is atleast **15GB** free on the disk where the Virtual Machine is installed.

## Step 1. Install WebSVF components using ***WebSVF-backend***

Run the following command to install WebSVF Extensions and Dependencies (SVF, LLVM, Clang...):

```
sudo npx @websvf/create-analysis -i
```

**NOTE**: This will not work without Elevated/Administrator Privelages i.e. `npx create-analysis -i`

## Step 2. Perform Pre-Processing (Analysis)

### - Generate LLVM Bitcode (.bc) file

Generate the bitcode file for your program or project by using the following [WLLVM command](https://github.com/travitch/whole-program-llvm#building-a-bitcode-module-with-clang):

```
extract-bc c-project-executable -o c-project-executable.bc
```
Where *c-project-executable* and *c-project-executable.bc* are the names of your C/C++ project executable and the desired name for the LLVM Bitcode (.bc) file of the project executable, respectively.

**How to compile a C project or program to LLVM Bitcode (.bc)**: [Detecting memory leaks](https://github.com/SVF-tools/SVF/wiki/Detecting-memory-leaks) (Step 2)

### - Generate Bug Analysis from LLVM Bitcode (.bc) file

Run the following command from the same directory as the .bc file or specify the directory of the .bc file using the **`-d /path/to/bc-file-directory`** option (Refer to **[WebSVF-backend](https://github.com/akshatsinghkaushik/WebSVF-backend)** for more details about the **`create-analysis`** command ***options***).

```
npx @websvf/create-analysis
```

**NOTE**: This will not work with Elevated/Administrator Privelages i.e. `sudo npx @websvf/create-analysis`


## Step 3. Run WebSVF-frontend: server and extension

### Intructions:  

- **Open Project Folder in VSCode and Run WebSVF-backend**

    Run WebSVF-backend in the current project folder opened in your VSCode application window.

- **Initialise the '*WebSVF-frontend*' VSCode Extension**

    Install WebSVF-frontend-server by clicking on the ***'Bug Analysis Tool' button*** in the bottom left corner of your VSCode             application window (provided by the '*WebSVF-frontend*' VSCode Extension). Wait till the button reads: ***'Bug Analysis Tool:           Initialized'***

- **View the Bug Analysis for the Project**

    View the Bug Analysis for the Project by clicking on the ***'Bug Analysis Tool: Initialized' button***. The button text will turn red and the button will read ***'Bug Analysis Tool: Running'***. 
    (Please refer to the [Extension's Operation Guide](/src/WebSVF-frontend-extension/README.md#Extension-Operation-Guide) for more          information)

## Step 4. Run WebSVF-codemap-extension

- **Installed situation**
[vsix file download page](https://github.com/SVF-tools/WebSVF/releases/tag/0.0.1)  
  <img src='https://github.com/codemapweb/codemap_extension/blob/master/images/after_install.png' width='480'/>

  After 30 seconds installation, you can see the 3D CODE MAP logo at below left.
- **Follow [User Instructions](./src/codemap_extension/README.md)**  
  <img src='https://github.com/codemapweb/codemap_extension/blob/master/images/7.gif' width='480'/>
  
  Please follow the **[User Instructions](./src/codemap_extension/README.md)** to use it.


# Uninstalling WebSVF Extensions and Dependencies (SVF, LLVM, Clang...)


## Uninstall WebSVF components
```
sudo npx @websvf/create-analysis -u
```



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
