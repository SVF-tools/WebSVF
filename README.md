# WebSVF

***DEVS: Please refer to the [Developer Notes](https://github.com/SVF-tools/WebSVF/tree/master#developer-notes) for latest updates.***

***Don't make any changes in the ~/WORKSPACE directory during installation***

The following installation only works in an Ubuntu 18.04 environment, so please refer to [this guide](https://github.com/SVF-tools/WebSVF/blob/master/Install_VirtualBox.md) if you need assistance setting up a Virtual Machine. 

## Step 1. Clone Project Repository
Open a terminal window in your Ubuntu environment and run the following commands in order (if you encounter errors mentioning permissions then please run these commands prefixed with _sudo_):

Clone into the repository and direct terminal to the install file:

```
git clone https://github.com/SVF-tools/WebSVF.git
cd ./WebSVF/web-svf-install/
```

## Step 2. Run Install Script

Run the following command to begin installation:

```
source Setup.sh
```

## Step 3. [Launch Required Apps and Runtimes](https://youtu.be/OR-5y5QLoYw)

```

```

## Please Note

- **Repository Website:** If  https://svf-tools.github.io/WebSVF/  displays a blank page, please find an error icon in the address bar of your browser and click on it. An error window will pop out saying 'Insecure Content Blocked' since page security is not implemented yet, click on 'Load unsafe Scripts' to load the webpage.

- **Installing Code-Map-Web:** Make sure the Ubuntu environment (whether its on a local or virtual machine) has access to atleast: 
    - 4 Available Processor Cores
    - 5GB of Usuable Memory (RAM)

    The installation process will require approximately 3-4 hours based the system's hardware specifications.
    __At *different points* during the installation, *the user will be prompted to put in their password in the installation terminal window* (refer to the installation videos linked below) so please take care, else the installation will timeout and will need to be run again.__

    The installation process may run into errors during runtime (operation) because of network disconnects/timeouts or something else. Please delete the **WebSVF** and **WORKSPACE** folders from your home directory **(cd ~)** and run the code in [**Step 1. Cloning Project Repository**](https://github.com/SVF-tools/WebSVF#step-1-clone-project-repository) & [**Step 2. Run Install Script**](https://github.com/SVF-tools/WebSVF#step-2-run-install-script) of this README file for installing Code-Map-Web again. The installation will check all the steps and re-install from where the error occured.

    Refer to the following Installation Guide Videos if required:
    - Setup Ubuntu environment: https://youtu.be/-NtsJYkfTbg
    - Setup Code-Map-Web environment and install required tools: https://youtu.be/3uzP9sVxnjc
    - Running Code-Map-Web application: https://youtu.be/OR-5y5QLoYw

## Work-In-Progress

- 

## Developer Notes

- [21/03/2020]
Non-Essential code was pruned from the repository branches, to access the files please use these links: [***3d-codemap-server***](https://docs.google.com/uc?export=download&id=1SXbdeUj8KWGpz6FBztOOye2-UXBjSC3Q) , [***llvm_binary_install***](https://docs.google.com/uc?export=download&id=14wzusP0aTkkIBtH9S4TQSjiNhH9K8JZ5)

## Acknowledgement

WebSVF would not have been possible without its comprising tools and the individual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

-



## Patch Notes

- 5/12/19:  Sign Up to Newsletter adds emails to Test Firbase Realtime Database.

