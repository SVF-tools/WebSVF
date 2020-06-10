# **<p align="center">3D CODE MAP</p>**

<p align="center">
<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/logo.png' width='480'/>
</p>

**<p align="center">Program Analysis tool for bug detection. It is a vscode extension which can be installed into Vscode 1.43.0 at least.</p>**

**<p align="center">After the program is compiled by analysis, it is used to display the analysis node information.</p>**

## **<p align="center">Architecture Overview</p>**

<p align="center">
<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/codemap_flowchart.png' width='720'/>
</p>

## **Dev Instructions**

-   **Clone `WebSVF` repository**
-   **Run `cd ./WebSVF/src/codemap_extension`**
-   **Run `yarn`**
-   **Run `yarn go` for build or `F5` for debug**

If you want to make VSIX install file, make sure install vsce tools.

-   **[Install vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)**
-   **Run `vsce package`**

## **User Instructions**

### **Installation**

**1. Download extension: [VSIX file and TEST zip](https://github.com/SVF-tools/WebSVF/releases/tag/0.0.1)**

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/DOWNLOAD_VISX.png' width='720'/>

VSIX file is vscdoe extension. TEST zip for extension testing.

**2. Extension installation**

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/VSIX_installation.png' width='720'/>

Through this picture show to install extension. and then unzip TEST.zip. Use vscode open **TEST** work folder.

**3. Installed situation**

  <img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/after_install.png' width='720'/>

After 30 seconds installation, you can see the 3D CODE MAP logo at below left.

### **3D CODE MAP**

**1. Vscode open a C/C++ project**

**Require Folder and Files [[How to generate them]](https://github.com/SVF-tools/WebSVF/tree/master/src/codemap_extension/backend)**

-   **`C/C++ Project` in `VSCODE WORKSPACE`**
-   **`3D_CODE_GRAPH` as folder in `VSCODE WORKSPACE`**
-   **`control_flow_graph.json` in `3D_CODE_GRAPH`**
-   **`value_flow_graph.json` in `3D_CODE_GRAPH`**

<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/require.png' width='480'/>

You can try to use **TEST.zip** to unzip and open it for test or read [[How to generate them]](https://github.com/SVF-tools/WebSVF/tree/master/src/codemap_extension/backend) to build them for real project.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/project.gif" width='720'>

As you see, **3D_CODE_GRAPH** is needed to store control graph and value follow graph.

**2. Click statusbar to show 3D CODE MAP**

Trying to click on the button at the bottom left to run or stop.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/red.png" width='480'>

After a while time to wait all function load. if always loading, you can cancel it by **`[X]`** close the page.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/load.png" width='480'>

It will show the red block when all function stopped or show blue block when code map running.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/blue.png" width='480'>

After click to make it work, it will show like this.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/show.png" width='720'>

### **Control Graph**

**1. Show CFG or VFG**

Click the CFG or VFG button will show the two graph.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/1.gif" width='720'>

**2. Show node label**

Hover over any node will show the label.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/2.gif" width='720'>

**3. Jump to line**

Right Click node will jump to the code line.

<img src="https://github.com/SVF-tools/WebSVF/blob/master/docs/3.gif" width='720'>

**4. Show all label**

Click `NODE ID MODE` button will show all label on node.

-   **Ps: If you want use this function, Please make sure you PC or MAC have 4 cores and 4GB memory at least. More nodes or lines you have, more cores and memory you need. Be careful :)**

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
