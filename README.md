# CodeMap Bug Analysis Plugin

## **Index**
1. **[Description](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#Description)**
1. **[Setup Instruction](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#Setup-Instruction)**
1. **[Features](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#Features)**
1. **[More Information](https://github.com/SVF-tools/WebSVF/tree/bug-report-fe#For-more-information)**

# Description
This is a **Bug Analysis Extension** installed in VSCode, which can run across platforms, and support **[Bug Analysis Tool](https://github.com/SVF-tools/WebSVF/tree/bug-report-fe#Bug-Analysis-Tool---Front-End---NodeJS)**

This extension can detect whether the **Bug Analysis Tool** is missing. If missing, it will download the **Bug Analysis Tool** as a `` zip``  file in the user's root path, decompress the `` zip``  into a `` hidden folder``  in the user's root path and remove the `` zip`` . Also, if the **Bug Analysis Tool** is missing, but the `` hidden folder``  exists, this extension will remove the `` hidden folder``  first and then load the **Bug Analysis Tool** again.

This extension requires `` Bug-Analysis-Report.json `` file in the workspace directory, and will prompt users if this file is missing. It get the absolute path of `` Bug-Analysis-Report.json `` file and write it in the `` bug-analysis-JSON_absolute-dir.config `` to provide path for the **Bug Analysis Tool**.

The extension can run the **Bug Analysis Tool** and show the ***Analysis Report*** in an internal webview in the VSCode.

This extension can kill all workings related to this extension and dispose the special terminal.

All processes in this extension are controlled by a status bar according to different conditions.

# Setup Instruction
## 1. Clone Repository:

```
git clone -b bug_report_extension  https://github.com/SVF-tools/WebSVF.git
```
Change directory in the terminal to the cloned 'WebSVF' folder:

```
cd ./WebSVF/
```

## 2. Install Dependencies:

```
npm install
```

## 3. Start this extension:

```
f5
```
**Note1:** Make sure the root directory in VSCode is the 'WebSVF' directory as cloned in [Step 1](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#1-clone-repository)
**Note2:** When the final plug-in is finished, it will be packaged into a vsix file and installed directly into VSCode, no need to repeat steps 1 to 3. At the final completion, this Setup Instruction will be modified.

## 4. Execute commands in the extension:

A ***'status bar'*** in the bottom-left corner and can run ***'Initialization'***, ***'Analysis'*** and ***'Stop'*** functions according to different conditions.

(Please refer to [Features](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#features) section for details about these functions)

## Features

### 1. Initialization:
To **initialize** this extension and **'download from https://github.com/SVF-tools/WebSVF/archive/bug-report-fe.zip**, which is a Bug Analysis Tool to generate a bug report.


### 2. Analysis:
**Start** the node app and show the report in an internal webview in the VSCode.


### 3. Stop:
To **stop** all workings related to this extension.

### For more information

* [The node app which generates bug reports, in branch bug-report-fe](https://github.com/SVF-tools/WebSVF.git)

**Please contact me if you have any questions!**
