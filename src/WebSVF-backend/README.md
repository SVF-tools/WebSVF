# WebSVF-backend

## Description

This is a simple NodeJS CLI tool to easily install ***[WebSVF](https://github.com/SVF-tools/WebSVF)*** and run it.

## System Requirements - Pre-Requesites

### - Ubuntu >=20.04
Currently due to limitions of the WebSVF's dependency, SVF. WebSVF-backend can only be used with Ubuntu 20.04 or newer.

### - NPM >=v10.0
To run the WebSVF-backend scripts, npm version greater than 10.0 is required.

## Installation

```
sudo npm install -g @websvf/create-analysis
```

## Usage

### 1. Install WebSVF Extensions and Dependencies (SVF, LLVM, Clang...)

```
sudo create-analysis -i
```

**NOTE**: This will not work without Elevated/Administrator Privelages i.e. `create-analysis -i`

#### Options

##### **`-i`** or **`--install`** :

To install WebSVF and all its dependencies

##### **`-a user`** or **`--account user`** (Optional): 

Where the `--account` flag indicates that a String is being provided which is the `user` for which WebSVF should be installed. If the user is not specified with the `--account` flag then the user is prompted with a list of users to select from.

### 2. Generate Analysis for LLVM Bitcode (.bc) file

Generate the bitcode file for your program or project then run the following command from the same directory as the .bc file or specify the directory of the .bc file.

```
create-analysis
```

**NOTE**: This will not work with Elevated/Administrator Privelages i.e. `sudo create-analysis`

#### Options

##### **`-d bc-file-directory`** or **`--dir bc-file-directory`** (Optional):

Where `-d` or `--dir` flags indicate that the user wants to provide a path for the directory/folder containing the LLVM Bitcode (.bc) files. The `-d` flag is used cannot be left empty, it must be provided with a directory or the command will fail. If no `-d` flag is specified then the path for the directory containg the .bc files is assumed to be the current working directory from the terminal.

**How to compile a C project or program to LLVM Bitcode (.bc)**: [Detecting memory leaks](https://github.com/SVF-tools/SVF/wiki/Detecting-memory-leaks) (Step 2)




### 3. Uninstall WebSVF Extensions and Dependencies (SVF, LLVM, Clang...)

```
sudo create-analysis -u
```

**NOTE**: This will not work without Elevated/Administrator Privelages i.e. `create-analysis -i`
