# **3D Code Map**

<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/logo.png' width='520'/>

Program Analysis tool for bug detection.
It is a vscode extension which can be installed into Vscode 1.43.0 at least.

After the program is compiled by analysis, it is used to display the analysis node information.

## **Dev Instructions**

-  **Clone the repository**
-  **Run `cd codemap_extension`**
-  **Run `yarn`**  
-  **Run `yarn go` for build or `F5` for debug**

## **User Instructions**

### **Installation**

**1. Download extension: [VSIX file and TEST zip](https://github.com/SVF-tools/WebSVF/releases/tag/0.0.1)**

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/DOWNLOAD_VISX.png' width='720'/>

  VSIX file is vscdoe extension. TEST zip for extension testing. 

**2. Extension installation**  

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/VSIX_installation.png' width='720'/>

  Through this picture show to install extension. and then unzip TEST.zip. Use vscode open **TEST** work folder.

**3. Installed situation**  

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/3D_CODEMAP.png' width='720'/>

  After 30 seconds installation, you can see the 3D CODE MAP logo at below left.

### **3D CODE MAP**

**1. Vscode open a C/C++ project**

You can try to use **TEST.zip** to unzip and open it for test.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/project.gif" width='720'>

As you see, 3D_CODE_GRAPH is needed to store control graph and value follow graph.


**2. Click statusbar to show 3D CODE MAP**

Trying to click on the button at the bottom left.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/red.png" width='480'>

After a while time to wait all function load.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/load.png" width='480'>

It will show the red block when all function stopped.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/blue.png" width='480'>

After click to make it work, it will show like this.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/show.png" width='720'>

### **Control Graph**

**1. Show CFG or VFG**

Click the CFG or VFG button will show the two graph.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/1.gif" width='720'>


**2. show node label**

Hover over any node will show the label.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/2.gif" width='720'>

**3. Jump to line**

Right Click node will jump to the code line.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/3.gif" width='720'>


**4. Show all label**

Click `NODE ID MODE` button will show all label on node.

Ps: If you want use this function, Please make sure you PC or MAC have 4 cores and 4GB memory at least. 

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/4.gif" width='720'>

**5. Highlight Node and Jump to code line**

If the node info show the fileName and lineNumber, Click the node will jump into the code line.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/5.gif" width='720'>

**6. Show code line nodes**

active one or more code line and input:

Window or Linux: `ctrl + alt + l`

MAC: `cmd + alt + l`

It will show the all the code line nodes. if there is no highlight there. it means there is no node link the code line.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/6.gif" width='720'>

**7. Camera Positioning**

If you have highlight node there. you can use:

Window or Linux: `ctrl + alt + j` or `ctrl + alt + k`

MAC: `cmd + alt + ->` or `cmd + alt + <-`

It will make camera find the highlight node position.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/7.gif" width='720'>

