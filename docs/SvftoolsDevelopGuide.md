# Developer Instructions
## **How to generate extension file ?**
-  ### System: **Linux or Mac**  
-  ### **Step 1. Install development tools.**
    - **git**. **[The git download link](https://code.visualstudio.com/)**
    - **nodejs**. **[The nodejs download link](https://nodejs.org/zh-cn/download/)**
    - **yarn**. **[The yarn download link](https://classic.yarnpkg.com/en/docs/install/#windows-stable)**
    - **vscode**. **[The vscode download link](https://code.visualstudio.com/)**

-  ### **Step 2. Prepare development environment.**
    - **cmd: `git clone https://github.com/SVF-tools/WebSVF.git --depth 1`**  
    - **cmd: `cd ./WebSVF/src/SVFTOOLS`**  
    - **cmd: `yarn`**  
    - **cmd: `code .`**  

- ### **Step 3. Generate extension**
    - **cmd: `sudo npm install -i vsce`** 
    - **cmd: `vsce package`**  
It will generate a extension named: **svftools-[version].vsix**

-  ### **To Compile:**   
    - **cmd: `yarn compile`**  
-  ### **To Debug:**  
    - **keyboard: [ _F5_ ]**  

## **How to install extension ?**

-  ### System: **Ubuntu 18.04 or 20.04**
- **Open [vscode](https://code.visualstudio.com/) or [code-server](https://github.com/cdr/code-server):**  
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='480'/>
