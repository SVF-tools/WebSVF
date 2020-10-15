# Bug Analysis Tool - Front-End - NodeJS

## **Index**
1. **[Description](#description)**
    1.  **[Bug-Analysis-Report.json Schema Breakdown](https://github.com/SVF-tools/WebSVF/blob/master/docs/Analysis%20Report%20Schema.md)**
        1. **[Project Bug Analysis Overview (Landing Page)](#project-bug-analysis-overview-landing-page)**
        1. **[Project Bug List by Bug-Type](#project-bug-list-by-bug-type)**
        1. **[Bug Analysis Report (per file)](#bug-analysis-report-per-file)**
    1.  **[Setup Instructions](#setup-instructions)**
<!-- 1. **[Developer Guide](#front-end-server-developer-guide)** -->
1. **[Reference](#reference)**

# Description:

The following NodeJS app generates the Front-End for the Bug Analysis Tool.

<img src="https://raw.githubusercontent.com/SVF-tools/WebSVF/master/docs/WebSVF%20Architecture.jpg">

The Node app requires `` Bug-Analysis-Report.json `` file from the Bug Analysis Tool's Back-End.
It reads the location of the ***Bug-Analysis-Report.json*** file from the `` bug-analysis-JSON_absolute-dir.config ``
present in the `` ./config `` directory of the Node app, which is also provided by the Bug Analysis Tool's Back-End.

For a full breakdown analysis of the schema for the `` Bug-Analysis-Report.json `` file, refer to **[this guide](https://github.com/SVF-tools/WebSVF/blob/master/docs/Analysis%20Report%20Schema.md)**.

The Node app then deploys a **ExpressJS** server at port **3000** (using http) to deploy the front-end. Reading from _Bug-Analysis-Report.json_ file, it obtains all the information about the **'.c files'** analysed by the Bug Analysis Tool's Back-End as well as the information about all the bugs present in them.

***The Node App is deployed primarily through the [VSCode extension](https://github.com/SVF-tools/WebSVF/tree/master/src/WebSVF-frontend-extension)***, which initialises the app and runs it inside a VSCode window as long the requisite conditions are met (i.e. ***Bug-Analysis-Report.json*** file is present). For development and testing purpopses however, please follow the [Setup Instructions](#setup-instructions) below to get the Front-End up and running.

The Front-End comprises of 3 different screens to diplay different Levels of Bug Reports for the analysed projects:

## Project Bug Analysis Overview (Landing Page)

The first half of the landing page consists of a brief overview of all the bugs analysed across the project processed by the Bug Analysis Tool's Back-End. By click on these checkbox you can choose to hide or show different type bug in the bug table. Click different bug type will go to **Bug Type Analysis** page's different tab, which will show you different bug type description.

<img src="https://i.imgur.com/KwiSDAd.png" height="400">


The second half of the page consists of a list of errors present in the analysed project categorised by the **'.c files'** in which they are found.

<img src="https://i.imgur.com/y4qR5un.png" height="400">

Full-Page:

<img src="https://i.imgur.com/mNZNBOC.png" height="400">


## Project Bug List by Bug-Type

This page is similar to the second half of the landing page but the list of errors present in the analysed project are categorised by their **Bug-Type** instead of the **'.c files'** in which they occur.

<img src="https://i.imgur.com/iG21Y49.png" height="400">

In some error box you can see a **cross origin** button, and click this button can show the error's synthesize exist path and line number. After user click it. The synthesize description card will shows on the bottom of current page. Click the error card's right narrow button will show and hide the next level's error description.

<img src="https://i.imgur.com/zrwIvnu.png" height="300" width="600">

It has a 'Left Arrow' Navigation button at the top to navigate back to the Landing Page. 

![Left-Arrow](https://i.imgur.com/GpTf9eI.png)

## Bug Analysis Report (per file)

This page contains the annotated code for one **'.c file'** with Error Bubble graphics (containing error information) on the right hand side of the page in-line with the line-number in the code on the left hand side of the page.

The page contains 4 types of buttons total, 3 buttons at the top (Home, ShowLines & RemoveLines). The ***Home*** button navigates back to the landing page. The ***Show Lines*** button draws reference lines between all the error bubbles on the page as well as connects the error bubbles on the right hand side of the page to the code where it occurs on the right hand side of the page, after click the  ***Show Lines*** button, it will change to ***Add lines*** button, click the ***Add lines*** button every time will deepen and overstriking all the error lines. The ***Remove Lines*** button removes all lines present on the page.
The last type of button called the ***Stack Trace*** button is present in each of the error bubbles, around the Error Title, clicking on which will generate reference lines on the left side of the page connecting lines of code affected by the error, the user clicked on. The reference lines generated by the *Stack Trace* button are color-coded Bug-Type of the error which generated the ***Stack Trace lines***. Click the ***Stack Trace*** button multiple times will also deepen and overstriking the stack trace lines.

Origin Bug Analysis Report page:

<img src="https://i.imgur.com/4MJP87o.png" height="400">

Click the **Show Lines** button:

<img src="https://i.imgur.com/mxuBgD6.png" height="400">  
  
Click the **Stack Trace** button:

<img src="https://i.imgur.com/HT1mY4K.png" height="400" width="540">

Click the **Add Lines** button or **Stack Trace** multiple times:

<img src="https://i.imgur.com/etQeK6s.png" height="400">

# Setup Instructions

Make sure you have the **[requisite software](https://github.com/SVF-tools/WebSVF/tree/master#step-1-install-requisite-software)** installed before following the Setup instructions.

Then follow the given steps to initialize the Node app in a ***testing environment***.
To run the app in the ***production environment***, please follow the [instructions](https://github.com/SVF-tools/WebSVF#installation-guide) on the [master](https://github.com/SVF-tools/WebSVF/) brach.

Please Note, all the commands mentioned below are to be typed/copied and run in the **terminal/command-prompt** window.

## 1. Clone Repository:

```
git clone https://github.com/SVF-tools/WebSVF.git
```
Change directory in the terminal to the cloned 'WebSVF' folder:

```
cd ./WebSVF/src/WebSVF-frontend-server
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

<!-- # Front End Server Developer Guide:

After you found the WebSVF-frontend-server folder according to the [Setup Instruction](#setup-instructions). You will see serval folders below:

- config
- node-scripts
- public
- test_files
- WebSVF-webpage

The node-scripts folder includes three files: 
 - file-report.js
 - landingPage.js
 - lanch_fe.js

The file-report.js file gennerates the file-report.html page's error element. The landingPage.js and lanch_fe.js generates   -->

# Reference:

In the given implementation of programmatic bugs are categorised in the following **3 Classes**:

### 1. **_Syntax_ Errors** (denoted with _Blue_)
### 2. **_Semantic_ Errors** (denoted with _Yellow/Orange_)
### 3. **_Logical_ Errors** (denoted with _Green_)

These error categories have also been given **2 additional attributes** as follows:

#### 1. **_Occurence_** (_Static_ or _Dynamic_ based on when the errors arise)
#### 2. **_Cross-Origin_** (Errors spanning across _multiple files_ in the project)

[Reference for error classification](https://www.inf.unibz.it/~calvanese/teaching/04-05-ip/lecture-notes/uni09/node2.html)
