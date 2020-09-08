# **<p align="center">SVF ANALYSIS TOOLS</p>**

<!-- <p align="center">
<img src='https://github.com/codemapweb/codemap_extension/blob/master/images/logo.png?raw=true' width='480'/>
</p>

**<p align="center">Program Analysis tool for bug detection. It is a vscode extension which can be installed into Vscode 1.43.0 at least.</p>**

**<p align="center">After the program is compiled by analysis, it is used to display the analysis node information.</p>**

## **<p align="center">Architecture Overview</p>**

<p align="center">
<img src='https://github.com/codemapweb/codemap_extension/blob/master/images/codemap_flowchart.png?raw=true' width='720'/>
</p> -->


## **Developer Instructions**  
### Developer System: **_Linux_ or _Mac_**  
### **Step 0. Install development tools.**  
- **git**. **[The git download link](https://code.visualstudio.com/)**
- **nodejs**. **[The nodejs download link](https://nodejs.org/zh-cn/download/)**
- **yarn**. **[The yarn download link](https://classic.yarnpkg.com/en/docs/install/#windows-stable)**
- **vscode**. **[The vscode download link](https://code.visualstudio.com/)**

### **Step 1. Prepare development environment.**
- **cmd: `git clone https://github.com/SVF-tools/WebSVF.git`**  
For clone WebSVF project.
- **cmd: `cd ./WebSVF/src/SVFTOOLS`**  
For get into extension part.
- **cmd: `yarn && npm install -i vsce`**  
For install library and install vsce publish extension tool.
- **cmd: `code .`**  
For open project in vscode.
### **Step 2. Compile and Debug project on vscode.** 
- **keyboard: [ ctrl + ` ]**  
For open vscode terminal
- **cmd: `yarn compile`**  
For compile extension source code. 
- **keyboard: [ F5 ]**  
For Debug source code.
### **Step 3. Generate extension**
- **cmd: `vsce package`**  
It will generate a new extension named: **svftools-[version].vsix**  


****  


### Test System: **_Ubuntu 18.04/20.04_**
### **Step 1. Install platform.**
- **Local test: [ vscode ] [The vscode download link](https://code.visualstudio.com/)**
- **Cloud test: [ code-server ] [The code-server download link](https://github.com/cdr/code-server)**
### **Step 2. Install extension.**
- **Transfer the plug-in to the test machine.**  
- **Install through the position shown in the figure below.**  
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='480'/>
