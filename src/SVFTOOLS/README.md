# **<p align="center">SVF ANALYSIS TOOLS</p>**

<p align="center">
<img src='https://github.com/spcidealacm/BugReport/blob/master/img/icon.png?raw=true' width='360'/>
</p>

## **System: [Ubuntu 18.04 / 20.04](https://releases.ubuntu.com/20.04/)**

## **User Instructions**

**After install this extenison, some new bar will show at bottom.**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/example.png?raw=true' width='1080'/>

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/extension.png?raw=true' height='40'/>**  
    **Install svf environment.**
    The plug-in will automatically detect whether the background configuration is complete. If the plug-in is just installed or the background environment is damaged, this icon will appear. At the same time, other functions will be suspended.

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/open_input.png?raw=true' height='40'/>**  
    **Open Input Project.**
    This function and the next function use the same button. The function will open the example.c file under _`INPUT_PROJECT`_. If the user is not currently in this directory, the project will be redirected first. When there is no example.c under _`INPUT_PROJECT`_, it will ask whether to configure this file. Choose Yes to configure and jump to this file.

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/open_svf.png?raw=true' height='40'/>**  
    **Open svf Backend.**
    This function uses the same button as the previous function. It will open the configuration file svf-ex.cpp under svf backend. When the folder does not exist or _`svf-ex.cpp`_ does not exist, it will ask you if you need to reconfigure the backend. Selecting Yes will re-download the new svf backend file and display it.

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/build_input.png?raw=true' height='40'/>**  
    **Build Input Project.**
    This button will only appear when _`INPUT_PROJECT`_ is opened and example.c exists. It can compile according to the rules of svf backend and generate error messages and static analysis graph information. The compilation process will appear in a Terminal.

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/build_backend.png?raw=true' height='40'/>**  
    **Build svf backend.** This button will only appear when the svf backend exists. Click this button after customizing the svf backend. It will compile and configure svf backend tools.

-   **<img src='https://github.com/SVF-tools/WebSVF/blob/master/src/BugReport/docs/svf_analysis.png?raw=true' height='40'/>**  
    **Show Analysis Report._(In the process of making...)_** This button will only appear after the INPUT_PROJECT compilation is successful, and it will display the compilation result in the form of a report.
