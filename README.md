# WebSVF

## **Index**

1. **[Architecture Overview](#architecture-overview)**
1. **[Description](#description)**
1. **[Installation Guide (for WebSVF-frontend: server and extension)](#installation-guide-for-websvf-frontend-server-and-extension)**
1. **[Installation Guide (for WebSVF-codemap-extension)](#installation-guide-for-websvf-codemap-extension)**
1. **[Known Issues](#known-issues)**
1. **[Developer Notes](#developer-notes)**
1. **[Acknowledgement](#acknowledgement)**

# Architecture Overview

<img src="docs/WebSVF Architecture.jpg">

# Description

The Web-SVF, Bug Analysis Tool is comprised of 3 main components:

- **[WebSVF-frontend-server](/src/WebSVF-frontend-server) :**

NodeJS based Web-Server that is responsible for Front-End output of the *Bug Analysis* Tool. Please refer to the **[WebSVF-frontend-extension](https://github.com/SVF-tools/WebSVF/tree/master/src/WebSVF-frontend-extension)** for instructions regarding its deployment. It is deployed automatically by the **Bug Analysis VSCode Extension**.

- **[WebSVF-frontend-extension](/src/WebSVF-frontend-extension) :**

This VSCode Extension serves as a wrapper for the NodeJS based Front-End for the *Bug Analysis* tool, **[WebSVF-frontend-server](https://github.com/SVF-tools/WebSVF/tree/master/src/WebSVF-frontend-server)**. It is deployed through the installation of the ***[WebSVF-frontend-extension_0.9.0.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/WebSVF-frontend-extension_0.9.0.vsix)*** file on *[VSCode locally](https://code.visualstudio.com/download)* or in *[code-server](https://github.com/cdr/code-server)* deployed online.

- **[WebSVF-codemap-extension](/src/codemap_extension/) :**

This VSCode Extension could use 3D force graph to present bug information. Vsix file need to create by user self. Please follow the user guide link to install. This extension needs to be used when there is a network.

# Installation Guide (for SVF)
SVF Installation only for Ubuntu 18.04 or 20.04 LTS.
Please follow the link to make it work: [WebSVF-codemap-extension](/src/SetupSVF/)


# Installation Guide (for WebSVF-frontend: server and extension)

## **Guide Video (Youtube)**

[![Installation Guide for Bug Analysis Tool (WebSVF)](https://img.youtube.com/vi/--a1rgFE_Cs/hqdefault.jpg)](https://www.youtube.com/watch?v=--a1rgFE_Cs)

## Step 1. Install Requisite Software

- **[Git](https://git-scm.com/downloads)**

- **[NodeJS](https://nodejs.org/en/download/)**


- **[VSCode](https://code.visualstudio.com/download)**


## Step 2. Download VSCode Extension File

Download the early release ***[WebSVF-frontend-extension_0.9.0.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/WebSVF-frontend-extension_0.9.0.vsix)*** file directly.

## Step 3. Install '*WebSVF-frontend*' VSCode Extension

Install '*WebSVF-frontend*' VSCode Extension in your VSCode application window from the directory where you downloaded the early release ***[WebSVF-frontend-extension_0.9.0.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/WebSVF-frontend-extension_0.9.0.vsix)*** file.

## Step 4. Open Project Folder in VSCode

Download and copy the [``Bug-Analysis-Report.json``](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/Bug-Analysis-Report.json) file in the current folder opened in your VSCode application window.

## Step 5. Initialise the '*WebSVF-frontend*' VSCode Extension

Install the dependencies for the Bug Analysis Tool's Front-End by clicking on the ***'Bug Analysis Tool' button*** in the bottom left corner of your VSCode application window (provided by the '*WebSVF-frontend*' VSCode Extension).

The ***'Bug Analysis Tool' button's*** text will now transform into a red color reading ***'Bug Analysis Tool: Initializing'***. Please wait until the button text transforms back to its original white color and reads ***'Bug Analysis Tool: Initialized'***. (Please refer to the [Extension's Operation Guide](/src/WebSVF-frontend-extension/README.md#Extension-Operation-Guide) for more information)

## Step 6. View the Bug Analysis for the Project

View the Bug Analysis for the Project by clicking on the ***'Bug Analysis Tool: Initialized' button***. Similar to the previous button transformation, the button text will turn red and the button will read ***'Bug Analysis Tool: Running'***. 

Clicking on the ***'Bug Analysis Tool: Running'*** button will generate another prompt asking if you want to stop the Bug Analysis Front-End app. Clicking on 'YES' will stop the app and close the Front-End whereas clicking on 'NO' will let the app keep running.
(Please refer to the [Extension's Operation Guide](/src/WebSVF-frontend-extension/README.md#Extension-Operation-Guide) for more information)

# Installation Guide (for WebSVF-codemap-extension)

If you follow have Bug report extension install guide. Step 1 should be ignore.

## Step 1. Install Requisite Software

- **[Git](https://git-scm.com/downloads)**

- **[NodeJS](https://nodejs.org/en/download/)**

- **[VSCode](https://code.visualstudio.com/download)**

## Step 2. Compile VSCode Extension File Or Use VSIX release
[VSIX Link](https://github.com/SVF-tools/WebSVF/releases/download/0.0.1/codemap-extension-0.0.1.vsix).
## Step 3. Open a project and Analysis in VSCode
## Setp 4. Show 3D code map and highlight link

Step 2 ~ 4 follow by the user instructions: [WebSVF-codemap-extension](/src/codemap_extension/). 



# Known Issues

- **3D-CodeMap Components not compatible with OS:** Please note that certain legacy components were developed specifically for ***Ubuntu 18.04 or 20.04***. If the component of Web-SVF you want to work with is not compatible with your OS please refer to [this guide](https://github.com/SVF-tools/WebSVF/blob/master/docs/Install_VirtualBox.md) for assistance setting up a Virtual Machine. 

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

# Developer Notes

## Patch Notes

Please find the CHANGELOG **[here](https://github.com/SVF-tools/WebSVF/blob/master/CHANGELOG.md)**

# Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

- **[SVF](https://github.com/SVF-tools/SVF) :**

SVF is a static tool that enables scalable and precise interprocedural dependence analysis for C and C++ programs. SVF allows value-flow construction and pointer analysis to be performed iteratively, thereby providing increasingly improved precision for both.
