## 1. Clone Repository:

```
git clone https://github.com/SVF-tools/WebSVF.git

git checkout bug-report-fe
```

## 2. Install Dependencies:

```
npm install
```

## 3. Run the App (Execution):

```
npm run start
```

# Description:

Deploys a ExpressJS server at port 3000, reading from test.json file from which it obtains the filepath of the first c file in the JSON array and serves it as an HTML on the deployed Web Server. [Accessible at http://localhost:3000]


# Reference:

In the given implementation bugs are categorised in the following 3 classes:

### 1. Syntax Errors (denoted with Blue)
### 2. Semantic Errors (denoted with Yellow/Orange)
### 3. Logical Errors (denoted with Green)

These errors categories have also been given two additional attributes as follows:

#### 1. Occurence (Static or Dynamic based on when the errors arise)
#### 2. Cross-Origin (Errors spanning across multiple files in the project)

Reference for error classification:
https://www.inf.unibz.it/~calvanese/teaching/04-05-ip/lecture-notes/uni09/node2.html