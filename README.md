## 1. Clone Repository:

```
git clone -b bug-report-fe https://github.com/SVF-tools/WebSVF.git
```

## 2. Install Dependencies:

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

# Description:

Deploys a **ExpressJS** server at port **3000**, reading from _test.json_ file from which it obtains the filepath of the first c file in the JSON array and serves it as an HTML on the deployed Web Server. Accessible at [localhost:3000](http://localhost:3000/)


# Reference:

In the given implementation of programmatic bugs are categorised in the following **3 Classes**:

### 1. **_Syntax_ Errors** (denoted with _Blue_)
### 2. **_Semantic_ Errors** (denoted with _Yellow/Orange_)
### 3. **_Logical_ Errors** (denoted with _Green_)

These error categories have also been given **2 additional attributes** as follows:

#### 1. **_Occurence_** (_Static_ or _Dynamic_ based on when the errors arise)
#### 2. **_Cross-Origin_** (Errors spanning across _multiple files_ in the project)

[Reference for error classification](https://www.inf.unibz.it/~calvanese/teaching/04-05-ip/lecture-notes/uni09/node2.html)