# WebSVF

***Don't make any changes in the ~/WORKSPACE directory during installation***

## Setting Up Ubuntu environment (optional)
If you have an Ubuntu environment setup, please skip to [**Step 1. Cloning Project Repository**](https://github.com/SVF-tools/WebSVF#step-1-clone-project-repository). 
Else perform the following steps:

### Download Oracle VirtualBox for your platform
Download VirtualBox from the following [link](https://www.virtualbox.org/wiki/Downloads)

### Download Fresh Ubuntu 18.04 Virtual Machine(VM) Image
Download a quick import VM-Image using this [Google Drive link (Size: 3.64GB)](https://drive.google.com/file/d/15jWQw2VIxDdAMKyKkGTCZllXN0E3_S98/view?usp=sharing)  
OR
Follow [this guide](https://www.toptechskills.com/linux-tutorials-courses/how-to-install-ubuntu-1804-bionic-virtualbox/) to download and setup an Ubuntu Virtual Machine using the Ubuntu Installation file (.iso) 

### Import the Ubuntu VM-Image into Virtual Box
Using the following images, quickly setup and customise your own Ubuntu 18.04 Virtual Machine on VirtualBox:

**Launch VirtualBox:**

![Launch VirtualBox](https://i.imgur.com/du9esrZ.png)

**Click Import:**

![Click Import](https://i.imgur.com/0igy1E6.png)

**Select VM-IMage File (.ova):**

![Select VM-IMage File](https://i.imgur.com/BpObObe.png)

**Browse to the Downloaded file**

![Browse to File](https://i.imgur.com/5R1ZDRd.png)

## Step 1. Clone Project Repository
Open a terminal window in your Ubuntu environment and run the following commands in order (if you encounter errors mentioning permissions then please run these commands prefixed with _sudo_):

Clone into the repository and direct terminal to the install file:

```
cd ~
git clone https://github.com/SVF-tools/WebSVF.git
cd ./WebSVF/
cd ./web-svf-install/
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

- **Installing Code-Map-Web:** 
    Recommended Specifications for the machine (local or virtual) running Ubuntu for installing this project: 
    - atleast 2 Available Processor Cores
    - atleast 2GB of Usuable Memory (RAM)

    The installation process will require approximately 20 - 40 minutes based the system's hardware specifications.
    __At *different points* during the installation, *the user may be prompted to put in their password in the installation terminal window* (refer to the installation videos linked below) so please take care, else the installation will timeout and will need to be run again.__

    The installation process may run into errors during runtime (operation) because of network disconnects/timeouts or something else. Please delete the **WebSVF** and **WORKSPACE** folders from your home directory (_cd ~_) and run the code in [**Step 1. Cloning Project Repository**](https://github.com/SVF-tools/WebSVF#step-1-clone-project-repository) & [**Step 2. Run Install Script**](https://github.com/SVF-tools/WebSVF#step-2-run-install-script) of this README file for installing Code-Map-Web again. The installation will check all the steps and re-install from where the error occured.

    Refer to the following Installation Guide Videos if required:
    - Setup Ubuntu environment: https://youtu.be/-NtsJYkfTbg
    - Setup Code-Map-Web environment and install required tools: https://youtu.be/3uzP9sVxnjc
    - Running Code-Map-Web application: https://youtu.be/OR-5y5QLoYw

## Work-In-Progress

- 

## Developer Notes

WebSVF would not have been possible without its comprising tools and the ividual contributions of all its collaborators. 
Links to the individual repositories for all contituent components are listed below along with their configuration in the offline-install in this repository.

-



## Patch Notes

- 5/12/19:  Sign Up to Newsletter adds emails to Test Firbase Realtime Database.

