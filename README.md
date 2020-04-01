# Bug Analysis Tool - Front-End - NodeJS

# Description:

The following NodeJS app generates the Front-End for the Bug Analysis Tool.

The Node app requires `` Bug-Analysis-Report.json `` file from the Bug Analysis Tool's Back-End.
It reads the location of the ***Bug-Analysis-Report.json*** file from the `` bug-analysis-JSON_absolute-dir.config ``
present in the `` ./config `` directory of the Node app, which is also provided by the Bug Analysis Tool's Back-End.

For a full breakdown analysis of the schema for the `` Bug-Analysis-Report.json `` file, refer to **[this guide](https://github.com/SVF-tools/WebSVF/blob/bug-report-fe/docs/Analysis%20Report%20Schema.md)**.

The Node app then deploys a **ExpressJS** server at port **3000** (using http) to deploy the front-end. Reading from _Bug-Analysis-Report.json_ file, it obtains all the information about the **'.c files'** analysed by the Bug Analysis Tool's Back-End as well as the information about all the bugs present in them.

***The Node App is deployed primarily through the [VSCode extension](https://github.com/SVF-tools/WebSVF/tree/bug_report_extension)***, which initialises the app and runs it inside a VSCode window as long the requisite conditions are met (i.e. ***Bug-Analysis-Report.json*** file is present). For development and testing purpopses however, please follow the [Setup Instructions](https://github.com/SVF-tools/WebSVF/tree/bug-report-fe#setup-instructions) below to get the Fron-End up and running.

The Front-End comprises of 3 different screens to diplay different Levels of Bug Reports for the anlysed projects:

- **Project Bug Analysis Overview (Landing Page) :**



- **Project Bug List by Bug-Type :**



- **Bug Analysis Report (per file) :**



# Setup Instructions

Make sure you have the [requisite software](https://github.com/SVF-tools/WebSVF/tree/master#step-1-install-requisite-software) installed before following the Setup instructions.

Then follow the given steps to initialize the Node app in a ***testing environment***.
To run the app in the ***production environment***, please follow the [instructions](https://github.com/SVF-tools/WebSVF/#step-by-step-installation-guide) on the [master](https://github.com/SVF-tools/WebSVF/) brach.

Please Note, all the commands mentioned below are to be typed/copied and run in the **terminal/command-prompt** window.

## 1. Clone Repository:

```
git clone -b bug-report-fe https://github.com/SVF-tools/WebSVF.git
```
Change directory in the terminal to the cloned 'WebSVF' folder:

```
cd ./WebSVF/
```

## 2. Install Dependencies (Optional):

```
npm install
```

### Install Dev Dependencies (optional)
```
npm install --only=dev
```

## 3. Run the App (Execution):

```
npm run start
```

### Run the App (Dev)

```
npm run start-dev
```

After launch, the app is accessible at [localhost:3000](http://localhost:3000/).

# Reference:

In the given implementation of programmatic bugs are categorised in the following **3 Classes**:

### 1. **_Syntax_ Errors** (denoted with _Blue_)
### 2. **_Semantic_ Errors** (denoted with _Yellow/Orange_)
### 3. **_Logical_ Errors** (denoted with _Green_)

These error categories have also been given **2 additional attributes** as follows:

#### 1. **_Occurence_** (_Static_ or _Dynamic_ based on when the errors arise)
#### 2. **_Cross-Origin_** (Errors spanning across _multiple files_ in the project)

[Reference for error classification](https://www.inf.unibz.it/~calvanese/teaching/04-05-ip/lecture-notes/uni09/node2.html)
