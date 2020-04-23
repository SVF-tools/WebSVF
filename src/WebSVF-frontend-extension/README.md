# CodeMap Bug Analysis Plugin

## **Index**
1. **[Description](#Description)**
1. **[Setup Instruction](#Setup-Instruction)**
1. **[Vsix Generation Guide](#Vsix-Generation-Guide)**
1. **[More Information](#For-more-information)**

# Description
This is a **Bug Analysis Extension** installed in VSCode, which can run across platforms, and support **[Bug Analysis Tool](https://github.com/SVF-tools/WebSVF/tree/WebSVF-frontend-server#Bug-Analysis-Tool---Front-End---NodeJS)**

This extension can detect whether the **Bug Analysis Tool** is missing. If missing, it will download the **Bug Analysis Tool** as a `` zip``  file in the user's root path, decompress the `` zip``  into a `` hidden folder``  in the user's root path and then remove the `` zip``. Also, if the **Bug Analysis Tool** is missing, but the `` hidden folder``  exists, this extension will remove the `` hidden folder``  firstly and then load the **Bug Analysis Tool** again.

This extension requires `` Bug-Analysis-Report.json `` file in the workspace directory, and will prompt users if this file is missing. It gets the absolute path of `` Bug-Analysis-Report.json `` file and writes it in the `` bug-analysis-JSON_absolute-dir.config `` to provide the path for the **Bug Analysis Tool**.

The extension can run the **Bug Analysis Tool** and start an ininternal webview in the VSCode to listen to the port 3000 to show the ***Analysis Report***.

This extension can kill all workings related to this extension and dispose of the special terminal.

***All processes in this extension are controlled by a status bar (Information displayed is variable) according to different conditions.***

# Setup Instruction
## 1. Clone Repository:

```
git clone https://github.com/SVF-tools/WebSVF.git
```
Change directory in the terminal to the cloned 'WebSVF' folder:

```
cd ./WebSVF/src/WebSVF-frontend-extension
```

## 2. Install Dependencies:

```
npm install
```

## 3. Start this extension:

```
Press F5
```
**Note 1:** Make sure the root directory in VSCode is the 'WebSVF' directory as cloned in [Step 1](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#1-clone-repository).

**Note 2:** When the final plug-in is finished, it will be packaged into a **vsix** file (Compressed file in plug-in format) and installed directly into VSCode, no need to repeat steps 1 to 3. At the final completion, this Setup Instruction will be modified.

## 4. Execute commands in the extension:

A ***'status bar'*** named ***'Bug Analysis Tool'*** in the bottom-left corner and can run ***'Initialization'***, ***'Analysis'*** and ***'Stop'*** functions according to different conditions.

(Please refer to [Description](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#Description) section for details about these functions)

# Vsix Generation Guide

Manually generate vsix extension file instead of downloading via termial. Be sure in the extension directory.

<img src="/src/WebSVF-frontend-extension/gifs/PackageVsix.gif" height="480">

```
sudo npm i vsce -g
```

```
vsce package
```

### For more information

* [The node app which generates bug reports, in branch WebSVF-frontend-server](https://github.com/SVF-tools/WebSVF.git)

**Please contact me if you have any questions!**
