# CodeMap Bug Report Plugin README

## 1. Clone Repository:

```
git clone -b bug_report_extension  https://github.com/SVF-tools/WebSVF.git
```

## 2. Install Dependencies:

```
npm install
```

## 3. Start this extension:

```
f5
```

## 4. Execute commands in the extension:

***'Ctrl + Shift + p'*** and search for ***'Report init'*** and ***'Report stop'*** commands.
Additionally there is also a customized icon(*in the top-right*) ==> ***Bug Report*** for running the Bug-Report extension.

(Please refer to [Features](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension#features) section for details about these commands)

## Features

### 1. Report init:
**To initialize this extension and 'git clone -b bug-report-fe https://github.com/SVF-tools/WebSVF.git', which is a node app to generate a bug report;**


### 2. Report stop:
**To stop all workings related to this extension.**


### 3. Bug Report:
**Start the node app and show the report in an internal webview in the vscode.**


## Known Issues

No suitable method was found to make the icon appear or disappear according to the specific conditions. Therefore, when this icon cannot be used, clicking on this icon will generate a prompt, and functions are performed normally when available.
I will improve it when I find a better way.

### For more information

* [The node app which generates bug reports, in branch bug-report-fe](https://github.com/SVF-tools/WebSVF.git)

**Please contact me if you have any questions!**
