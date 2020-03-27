# Web-SVF

***DEVS: Please refer to the [Developer Notes](https://github.com/SVF-tools/WebSVF/tree/master#developer-notes) for latest updates.***

***For Development instructions regarding any of the components comprising Web-SVF please refer to the repective branches:***
***(Setup Instructions in each branch assume you have followed **[Step 1. Setup Requisite Software](https://github.com/SVF-tools/WebSVF/tree/master#step-1-setup-requisite-software)** in this guide below)***

- **[bug-report-fe](https://github.com/SVF-tools/WebSVF/tree/bug-report-fe)**
NodeJS based Web-Server that is responsible for Front-End output of the *Bug Analysis* Tool. Please refer to the **[bug_report_extension](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension)** for instructions regarding its deployment. It is deployed automatically by the **Bug Analysis VSCode Extension**.

- **[bug_report_extension](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension)**
This VSCode Extension serves as a wrapper for the NodeJS based Front-End for the *Bug Analysis* tool, **[bug-report-fe](https://github.com/SVF-tools/WebSVF/tree/bug-report-fe)**. It is deployed through the installation of the *bug-report-fe.vsix* on *[VSCode locally](https://code.visualstudio.com/download)* or in *[code-server]()* deployed online. The *bug-report-fe.vsix* can be found in the [master brach].

- **[code_map_extensions](https://github.com/SVF-tools/WebSVF/tree/code_map_extension)**

## Step 1. Setup Requisite Software

### Windows

### Ubuntu

## Step 2. Clone Project Repository

Clone into the repository:

```
git clone https://github.com/SVF-tools/WebSVF.git
```

## Step 3. Run Install Script


## Step 4. [Launch Required Apps and Runtimes](https://youtu.be/OR-5y5QLoYw)

```

```

## Known Issues

- **Component non compatible with OS:** If the component of Web-SVF is not compatible with your OS, please note that certain legacy components were developed specifically for ***Ubuntu 18.04***. If you run into such issues please refer to [this guide](https://github.com/SVF-tools/WebSVF/blob/master/Install_VirtualBox.md) if you need assistance setting up a Virtual Machine. 

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

## Work-In-Progress

- 

## Developer Notes

**Non-Essential code was pruned from the repository branches, to access the files please use these links:**

- [27/03/2020]
[***master***](https://docs.google.com/uc?export=download&id=1iAoCApwVEGajNFXaUmLMclrSs5AjnrLE)

- [21/03/2020]
Non-Essential code was pruned from the repository branches, to access the files please use these links: [***3d-codemap-server***](https://docs.google.com/uc?export=download&id=1SXbdeUj8KWGpz6FBztOOye2-UXBjSC3Q) , [***llvm_binary_install***](https://docs.google.com/uc?export=download&id=14wzusP0aTkkIBtH9S4TQSjiNhH9K8JZ5)

## Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

- **[SVF](https://github.com/SVF-tools/SVF)**
SVF is a static tool that enables scalable and precise interprocedural dependence analysis for C and C++ programs. SVF allows value-flow construction and pointer analysis to be performed iteratively, thereby providing increasingly improved precision for both.


## Patch Notes

Please find the CHANGELOG **[here](https://github.com/SVF-tools/WebSVF/blob/master/CHANGELOG.md)**
