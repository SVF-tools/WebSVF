# WebSVF

This is the WebSVF repo which highlights the static webSVF github io for redirecting to the deployed WebSVF pages
  https://svf-tools.github.io/WebSVF/

Capstone Project for the WebSVF can be found within this Repo as a sub module
learn more about submodules at https://git-scm.com/book/en/v2/Git-Tools-Submodules 

For a quick introduction to the latest addition in WebSVF 4.0, the CodeGPT panel, please have a watch of this video:
https://www.youtube.com/watch?v=Gf6vAyzOlJ0

The new feature allows users to communicate with OpenAI's GPT 3.5-Turbo engine, and attach any of their files present on the site!

# Installation of webSVF 5.0
Note, webSVF 5.0 uses svf-ex executable from previous webSVF to create graphs. The executable can only run in x86 architecture (not arm64). Installation should be completed on linux for best results.

# Downloading dotnet 8 on Linux
Go to this website
```
https://dotnet.microsoft.com/en-us/download/dotnet/8.0
```

Download sdk for dotnet 8.0. Click on x64 for binaries if using x64 architecture. Click arm64 if running on M-series macbook. This should automatically download the binary as a tar file.
```
cd Downloads
```
Go into downloads and run the following commands. (These commands were taken from the download page)

```
mkdir -p $HOME/dotnet && tar zxf dotnet-sdk-8.0.402-linux-x64.tar.gz -C $HOME/dotnet
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

Run the 2 export commands every time you open up a new terminal session. You could also edit the your shell profile to permanently add the commands. 

# Downloading node manager for frontend

Install Node Version Manager (nvm) by running the following command
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

Install Node version 20 by running following command
```
nvm install 20
```

You can check the node version by running following command. It should say v20.*.*
```
node -v
```

# How to run frontend
Go into frontend folder
```
cd frontend
```
Run npm run dev
```
npm run dev
```

# Backend Deployment
Backend is currently deployed using fly.io.

# Frontend Deployment
Frontend is currently deployed using Vercel.

END OF WEBSVF 5.0 INSTALLATION


# Installation guide for WebSVF 4.0
Note: Installation should be completed on linux for best results.

## 1. Install Nodejs 15 and other dependancies
```
sudo apt install nodejs@15
sudo apt-get install clang cmake gcc g++ doxygen graphviz zlib1g-dev unzip libtinfo5
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

### If the above commands do not work, you can manually download Dotnet 3.1 here

You can download any version as long as it is 3.1 version of SDK.

https://dotnet.microsoft.com/en-us/download/dotnet/3.1

After downloading, go to downloads folder and run the following commands.
```
cd
cd Downloads
mkdir -p $HOME/dotnet && tar zxf dotnet-sdk-3.1.302-win-x64.exe -C $HOME/dotnet
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

If you have downloaded manually, you will need to run these commands everytime the machine is restarted (or add these commands to appropriate source file to avoid copy and pasting this command when computer restarts)
```
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

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

# Notes

## Install dependencies
Install the following dependencies if required
```
npm i svf-lib
```
## Pulling the submodule from CapstoneProject
This command is be required to retrieve the latest files within CapstoneProject or any other repo you add.
```
git submodule update --init
```

## Create EC2 instance from custom WebSVF AMI

These instructions are adapted from official AWS documentation (sources listed below).

It is highly recommended you read through the sources in detail if you're unfamiliar with the AWS environment, especially with AWS EC2.

WebSVF AMI: `ami-06787f758a0b88e83`
### 1a. Sign up for an AWS account
If you do not have an AWS account, complete the following steps to create one.

To sign up for an AWS account
1. Open https://portal.aws.amazon.com/billing/signup.

2. Follow the online instructions.

Part of the sign-up procedure involves receiving a phone call and entering a verification code on the phone keypad.

When you sign up for an AWS account, an AWS account root user is created. The root user has access to all AWS services and resources in the account. As a security best practice, assign administrative access to an administrative user, and use only the root user to perform tasks that require root user access.

AWS sends you a confirmation email after the sign-up process is complete. At any time, you can view your current account activity and manage your account by going to https://aws.amazon.com/ and choosing My Account.

### 1b. Login to AWS account
Login to your AWS account through the [AWS Management Console](https://aws.amazon.com/console/).

### 2. Create a key pair
1. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.

2. In the navigation pane, choose `Key Pairs`.

3. Choose `Create key pair`.

4. For `Name`, enter a descriptive name for the key pair. Amazon EC2 associates the public key with the name that you specify as the key name.

5. For Key pair type, choose `RSA`

6. For `Private key file format`, choose the format in which to save the private key.

7. Choose `Create key pair`.

8. The private key file is automatically downloaded by your browser. The base file name is the name you specified as the name of your key pair, and the file name extension is determined by the file format you chose. Save the private key file in a safe place.
### 3. Access Amazon EC2
Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/

### 4. Launch EC2 instance
1. From the EC2 console dashboard, in the `Launch instance` box, choose `Launch instance`, and then choose `Launch instance` from the options that appear.

2. Under `Name and tags`, for `Name`, enter a descriptive name for your instance.

3. Under `Application and OS Images (Amazon Machine Image)`, do the following:

   - Choose Quick Start, and then choose Amazon Linux. This is the operating system (OS) for your instance.

   - From Amazon Machine Image (AMI), choose Browse more AMIs to browse the full AMI catalog.

   - Choose Community AMIs

   - Search for the AMI `ami-06787f758a0b88e83`

   - Select it

4. Under Key pair (login), for Key pair name, choose the key pair that you created when getting set up.

5. Review a summary of your instance configuration in the `Summary` panel, and when you're ready, choose `Launch instance`.

## Troubleshoot

### No usable version of libssl was found error
If this error occurs, there should be a libssl1.1_1.1.1-1ubuntu2.1~18.04.21_amd64.deb that can be installed by running the following command.

```
sudo dpkg -i libssl1.1_1.1.1-1ubuntu2.1~18.04.21_amd64.deb
```

If this libssl file is not here, you can run the following commands
```
wget https://www.openssl.org/source/openssl-1.1.1c.tar.gz
tar -xzvf openssl-1.1.1c.tar.gz
cd openssl-1.1.1c
./config
make
sudo make install (it puts it into /usr/local/lib so it doesn't mess with the rest of your system)
```
Then, run this command to map this command temporarily via LD_LIBRARY_PATH. You will need to run this command everytime the computer restarts.

```
export export LD_LIBRARY_PATH="/usr/local/lib"
```
Source for no usable libssl if there is no libssl file.
https://github.com/dotnet/core/issues/4749 

### API Key
If you want to change the API key for codeGPT or come across the error 'apiKey' does not exist.

Add the APIKey in environment.ts (clientApp->src/environments->environments.ts).

To generate the API key, you will need to:
1. create an account with OpenAI.
2. After logging in, select 'API'.
3. Click on the GPT icon in the top left corner to expand the sidebar
4. Select API Keys. Here, you can generate a key and add it as the value to the apiKey variable.

An alternative method can also be to use a dotenv file, you can find some documentation on this here. This will allow you to secure the API keys over public repositories.
https://betterprogramming.pub/how-to-secure-angular-environment-variables-for-use-in-github-actions-39c07587d590

## Sources

https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2-instances.html

https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance-wizard.html
