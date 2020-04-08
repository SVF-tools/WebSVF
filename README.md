# Web-SVF

## **Index**

1. **[Description](https://github.com/SVF-tools/WebSVF#description)**
1. **[Installation Guide](https://github.com/SVF-tools/WebSVF#installation-guide)**
1. **[Architecture Diagram](https://github.com/SVF-tools/WebSVF#architecture-diagram)**
1. **[Known Issues](https://github.com/SVF-tools/WebSVF#known-issues)**
1. **[Developer Notes](https://github.com/SVF-tools/WebSVF#developer-notes)**
1. **[Acknowledgement](https://github.com/SVF-tools/WebSVF#acknowledgement)**

# Description

The Web-SVF, Bug Analysis Tool is comprised of 3 main components:

- **[bug-report-fe](https://github.com/SVF-tools/WebSVF/tree/master/src/bug-report-fe) :**

NodeJS based Web-Server that is responsible for Front-End output of the *Bug Analysis* Tool. Please refer to the **[bug_report_extension](https://github.com/SVF-tools/WebSVF/tree/master/src/bug-report-fe_extension)** for instructions regarding its deployment. It is deployed automatically by the **Bug Analysis VSCode Extension**.

- **[bug_report_extension](https://github.com/SVF-tools/WebSVF/tree/master/src/bug-report-fe_extension) :**

This VSCode Extension serves as a wrapper for the NodeJS based Front-End for the *Bug Analysis* tool, **[bug-report-fe](https://github.com/SVF-tools/WebSVF/tree/master/src/bug-report-fe)**. It is deployed through the installation of the ***[bug-report-fe.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/bug-report-fe_extension_0.9.0.vsix)*** file on *[VSCode locally](https://code.visualstudio.com/download)* or in *[code-server](https://github.com/cdr/code-server)* deployed online.

- **[code_map_extensions](https://github.com/SVF-tools/WebSVF/tree/code_map_extension)**


***DEVS: Please refer to the [Developer Notes](https://github.com/SVF-tools/WebSVF/tree/master#developer-notes) for latest updates.***

# Installation Guide

## **Guide Video (Youtube)**

[![Installation Guide for Bug Analysis Tool (WebSVF)](https://img.youtube.com/vi/--a1rgFE_Cs/hqdefault.jpg)](https://www.youtube.com/watch?v=--a1rgFE_Cs)

## Step 1. Install Requisite Software

- **[Git](https://git-scm.com/downloads)**

- **[NodeJS](https://nodejs.org/en/download/)**


- **[VSCode](https://code.visualstudio.com/download)**


## Step 2. Download VSCode Extension File

There are two methods to obtain the VSCode Extension Install file, the easiest is to download the early release ***[bug-report-fe_extension_0.9.0.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/bug-report-fe_extension_0.9.0.vsix)*** file directly or *clone the git repository (Not Recommended: significantly larger download size)*.

### Clone Git Repository (Large Download Size)

Launch the installed VSCode application. 

Browse to the directory where you want to install the WebSVF repository.

<img src="gifs/OpenVSCode.gif" height="480">

Open a new Terminal/Command-Prompt in VSCode:

<img src="gifs/TerminalGitClone.gif" height="480">

Clone into the repository by entering the following command in the Terminal/Command-Prompt:

```
git clone https://github.com/SVF-tools/WebSVF.git
```

## Step 3. Install '*Bug-Report-FE*' VSCode Extension

Install '*Bug-Report-FE*' VSCode Extension in your VSCode application window from the directory where you downloaded the early release ***[bug-report-fe_extension_0.9.0.vsix](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/bug-report-fe_extension_0.9.0.vsix)*** file.

<img src="gifs/DirectInstallExt.gif" height="480">

If you used ***Git***, the file can be found in the following directory: ``WebSVF/src/bug-report-fe_extension/``

<img src="gifs/GitInstallExt.gif" height="480">

## Step 4. Open Project Folder in VSCode

Download and copy the [``Bug-Analysis-Report.json``](https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/Bug-Analysis-Report.json) file in the current folder opened in your VSCode application window.

<img src="gifs/OpenProjectFolder.gif" height="480">

## Step 5. Initialise the '*Bug-Report-FE*' VSCode Extension

Install the dependencies for the Bug Analysis Tool's Front-End by clicking on the ***'Bug Analysis Tool' button*** in the bottom left corner of your VSCode application window (provided by the '*Bug-Report-FE*' VSCode Extension).

The ***'Bug Analysis Tool' button's*** text will now transform into a red color reading ***'Bug Analysis Tool: Initializing'***. Please wait until the button text transforms back to its original white color and reads ***'Bug Analysis Tool: Initialized'***.

<img src="gifs/InitialiseExtension.gif" height="480">

## Step 6. View the Bug Analysis for the Project

View the Bug Analysis for the Project by clicking on the ***'Bug Analysis Tool: Initialized' button***. Similar to the previous button transformation, the button text will turn red and the button will read ***'Bug Analysis Tool: Running'***. 

Clicking on the ***'Bug Analysis Tool: Running'*** button will generate another prompt asking if you want to stop the Bug Analysis Front-End app. Clicking on 'YES' will stop the app and close the Front-End whereas clicking on 'NO' will let the app keep running.

<img src="gifs/RunExtension.gif" height="480">

# Architecture Diagram

<img src="https://i.imgur.com/0aep07k.png" height="640">

# Known Issues

- **3D-CodeMap Components not compatible with OS:** Please note that certain legacy components were developed specifically for ***Ubuntu 18.04***. If the component of Web-SVF you want to work with is not compatible with your OS please refer to [this guide](https://github.com/SVF-tools/WebSVF/blob/master/docs/Install_VirtualBox.md) for assistance setting up a Virtual Machine. 

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

# Developer Notes

## Patch Notes

Please find the CHANGELOG **[here](https://github.com/SVF-tools/WebSVF/blob/master/CHANGELOG.md)**

# Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

- **[SVF](https://github.com/SVF-tools/SVF) :**

SVF is a static tool that enables scalable and precise interprocedural dependence analysis for C and C++ programs. SVF allows value-flow construction and pointer analysis to be performed iteratively, thereby providing increasingly improved precision for both.
