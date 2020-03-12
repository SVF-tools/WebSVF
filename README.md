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

```
ctrl+shift+p and search 'Report init' and 'Report stop', a customized icon(in the top-right) ==> Bug Report;
```

## Features
```
1. Report init: To initialize this extension and 'git clone -b bug-report-fe https://github.com/SVF-tools/WebSVF.git', which is a node app to generate a bug report;
```
```
2. Report stop: To stop all workings related to this extension.
```
```
3. Bug Report: Start the node app and show the report in an internal webview in the vscode.
```

## Known Issues

Currently, the icon cannot be visible and invisible depends on different circumstances, so I make it visible all the time. I will try to fix it up later.

### For more information

* [The node app which generates bug reports, in branch bug-report-fe](https://github.com/SVF-tools/WebSVF.git)

**Please contact me if you have any questions!**
