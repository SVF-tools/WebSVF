# CodeMap Bug Analysis Plugin

## **Index**
1. **[Description](#Description)**
1. **[Source code Setup Instrction](#Source-Code-Setup-Instruction)**
1. **[VSIX Setup Instruction](##VSIX-Setup-Instruction)**
1. **[Extension Operation Guide](#Extension-Operation-Guide)**
1. **[Vsix Generation Guide](#Vsix-Generation-Guide)**
1. **[More Information](#For-more-information)**

# Description
This is a **Bug Analysis Extension** installed in VSCode, which can run across platforms, and support **[Bug Analysis Tool](https://github.com/SVF-tools/WebSVF/tree/master/src/WebSVF-frontend-server#bug-analysis-tool---front-end---nodejs)**
<img src="https://raw.githubusercontent.com/SVF-tools/WebSVF/master/docs/WebSVF%20Architecture.jpg">
This extension can detect whether the **Bug Analysis Tool** is missing. If missing, it will download the **Bug Analysis Tool** as a `` zip``  file in the user's root path, decompress the `` zip``  into a `` hidden folder``  in the user's root path and then remove the `` zip``. Also, if the **Bug Analysis Tool** is missing, but the `` hidden folder``  exists, this extension will remove the `` hidden folder``  firstly and then load the **Bug Analysis Tool** again.

This extension requires **[Bug-Analysis-Report.json](https://github.com/SVF-tools/WebSVF#setup-intructions)** file in the workspace directory, and will prompt users if this file is missing. It gets the absolute path of `` Bug-Analysis-Report.json `` file and writes it in the `` bug-analysis-JSON_absolute-dir.config `` to provide the path for the **Bug Analysis Tool**.

The extension can run the **Bug Analysis Tool** and start an ininternal webview in the VSCode to listen to the port 3000 to show the ***Analysis Report***.

This extension can kill all workings related to this extension and dispose of the special terminal.

***All processes in this extension are controlled by a status bar (Information displayed is variable) according to different conditions.***

<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Running_2.png">

# Source Code Setup Instruction
## 1. Clone Repository:

```
git clone https://github.com/SVF-tools/WebSVF.git
```
```
Open and change directory in the terminal to the directory WebSVF/src/WebSVF-frontend-extension
```

## 2. Install Dependencies:

```
Run npm install in the terminal
```

## 3. Start this extension:

```
Press F5 in your VSCode application window
```
**Note 1:** Make sure the root directory in VSCode is the **WebSVF/src/WebSVF-frontend-extension/** directory, not the ``WebSVF`` as cloned in [Step 1](#1-clone-repository).

**Note 2:** Another method to use this extension is to packag it into a **vsix** file (Compressed file in the VSCode Extension format) and can be installed directly into VSCode, no need to repeat steps 1 to 3. Please refer to the **[VSIX  Setup Instruction](#VSIX-Setup-Instruction)** to get the instruction via **vsix installing**.


# VSIX Setup Instruction
## 1. Get Vsix file:
**[Download the VSIX file](https://github.com/SVF-tools/WebSVF#step-2-download-vscode-extension-file)** or **[Generate the vsix file via source code](#Vsix-Generation-Guide)**

## 2. Install the WebSVF-frontend-extension vsix file
-   Click the **Extensions** in the left side.
-   Click **More actions** in the form of three dots in the **Extensions**.
-   Click **Install from VSIX**.
-   Choose the target vsix file, which should be ***WebSVF-frontend-extension** or other custom name.
-   Reload the VSCode window if required.
<img src="https://raw.githubusercontent.com/SVF-tools/WebSVF/master/docs/VSIX_installation.png">
**Note :** Currently, the **WebSVF-frontend-extension** should be installed and can be triggered. Please refer to the **[Extension Operation Guide](#Extension-Operation-Guide)**

# Extension Operation Guide
## 1. Brief Introduction:
A ***'status bar'*** named ***'Bug Analysis Tool'*** in the bottom-left corner and can run ***'Initialization'***, ***'Analysis'*** and ***'Stop'*** functions according to different conditions.

### Bug Analysis Tool
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool.jpg" height="50px">

### Bug Analysis Tool: Initializing
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Initializing.png" height="50px">

### Bug Analysis Tool: Initialized
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Initialized.jpg" height="50px">

### Bug Analysis Tool: Running
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Running.png" height="50px">

## 2. Initialise the '*WebSVF-frontend-Extension*':
Clicking on the ***'Bug Analysis Tool' status bar*** in the bottom left corner of your VSCode application window.

The ***'Bug Analysis Tool' status bar's*** text will now transform into a red color reading ***'Bug Analysis Tool: Initializing'***. Please wait until the status bar text transforms back to its original white color and reads ***'Bug Analysis Tool: Initialized'***.

<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool 2.png">
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Initializing 2.png">

## 3. View the Bug Analysis for the Project
View the Bug Analysis for the Project by clicking on the ***'Bug Analysis Tool: Initialized' status bar***. Similar to the previous status bar transformation, the status bar text will turn red and the status bar will read ***'Bug Analysis Tool: Running'***. 

Clicking on the ***'Bug Analysis Tool: Running'*** status bar will generate another prompt asking if you want to stop the Bug Analysis Front-End app. Clicking on 'YES' will stop the app and close the Front-End whereas clicking on 'NO' will let the app keep running.

<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Initialized 2.png">
<img src="/src/WebSVF-frontend-extension/gifs/Bug Analysis Tool Running 2.png">

**Note:** (Please refer to [Description](#Description) section for details about the functions)

# Vsix Generation Guide

Manually generate vsix extension file instead of downloading via termial. Be sure in the extension directory 'WebSVF/src/WebSVF-frontend-extension'.

<img src="/src/WebSVF-frontend-extension/gifs/PackageVsix.gif" height="480">
```
npm install
```

```
sudo npm i vsce -g
```

```
vsce package
```

### For more information

* [The node app which generates bug reports, WebSVF-frontend-server](https://github.com/SVF-tools/WebSVF/blob/master/src/WebSVF-frontend-server)

**Please contact me ([@ZichengQu](https://github.com/ZichengQu)) if you have any questions!**
