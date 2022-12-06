# WebSVF

# this is the WebSVF repo which highlights the static webSVF github io for redirecting to the deployed WebSVF pages
  https://svf-tools.github.io/WebSVF/

Capstone Project for the WebSVF can be found within this Repo as a sub module
learn more about submodules at https://git-scm.com/book/en/v2/Git-Tools-Submodules 

# pulling the submodule from CapstoneProject
this command will be required to retrieve the files within Capstone Project
```
git submodule update --init

```

# Installation Guide for WebSVF submodule project
# Installation guide for Web SVF

## 1. Install Nodejs
```
sudo apt install nodejs

```
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04

## 2. Install Angular
```
cd ClientApp \
sudo npm install -g @angular/cli

```
https://angular.io/guide/setup-local

## 3. Clone this repo
```
git clone https://github.com/Re-Tails/CapstoneProject.git
```

## 4. Install Dotnet

### Add the Microsoft package signing key
```
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
```

### Install the SDK
```
sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-3.1
```

### Install the runtime
```
sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y aspnetcore-runtime-3.1
```
https://docs.microsoft.com/en-au/dotnet/core/install/linux-ubuntu#2004-

## 7. Update the app
```
cd  ClientApp \
npm install \
npm run start //note: this will only run the Client App
```
## 6. Run the app
Run the following command from the CapstoneProject repo folder:
```
dotnet run
```

## Notes

Install the SVF dependencies if required
```
npm i svf-lib
```