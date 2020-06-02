//Step 1: Init
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var arguments = process.argv.splice(2);
var projectPath = arguments[0] + "/";
exec(". ./setup.sh");
String.prototype.endWith = function(endStr) {
    var d = this.length-endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d);
}
class BugReport {
    constructor(id, FileName, FilePath, Errors) {
        this.id = id;
        this.FileName = FileName;
        this.FilePath = FilePath;
        this.Errors = Errors;
    }
}

//Step 2: Scan the target dir to get all .bc files.
var bcFilesList = [];

var filesList = [];
var filesDir = arguments[0];
readFileList(filesDir, filesList);
var allFilesList = [];
readAllFileList(filesDir, allFilesList);
filesList.forEach(element => {
    if (element.endWith(".bc")) {
        bcFilesList.push(element);
    }
});

//Step 3: Loop bcFilesList and generate bug reports
bcFilesList.forEach(element => {
    console.log(element);
    var commend = 'saber -leak -stat=false ' + element;
    exec(commend, (err, stdout, stderr) => {
        if (stderr != "" && !(stderr.indexOf("failed") != -1)) {
            analyzeData_1(stderr.toString());
        }
    });
});

//Functions used in process
function analyzeData_1(output) {
    var bugreports;
    var bugreportsArray = [];
    var errors = [];
    var errorStringArray_1 = output.split("\n\n");
    errorStringArray_1.pop();
    //console.log(errorStringArray.length);
    var errorStringArray = [];
    errorStringArray_1.forEach(element => {
        if (element.indexOf("PartialLeak") != -1 && element.indexOf("NeverFree") != -1) {
            var array = element.split("\n");
            errorStringArray.push(array.shift());
            var partialLeakString = array.join("\n");
            errorStringArray.push(partialLeakString);
        } else {
            errorStringArray.push(element);
        }
    });
    errorStringArray.forEach(element => {
        console.log("-------------------------\n" + element);
        var error;
        if (element.indexOf("PartialLeak") != -1) {
            error = analyzePLError(element);
        }
        if (element.indexOf("NeverFree") != -1) {
            error = analyzeNFError(element);
        }
        errors.push(error);
    });
    var pathArray = [];
    errors.forEach(element => {
        pathArray.push(element.Path);
    });
    var pathSet = unique(pathArray);

    pathSet.forEach((path, index) => {
        var errorsByReport = [];
        var absolutePath = "";
        errors.forEach(element => {
            if (element.Path == path) {
                allFilesList.forEach(e => {
                    if (e.endWith(path)) {
                        absolutePath = e;
                    }
                });
                delete element.Path;
                errorsByReport.push(element);
            }
        })
        absolutePath = absolutePath.substring(0, absolutePath.lastIndexOf("/"));
        var bugreport = new BugReport(index, path, absolutePath, errorsByReport);
        bugreport = sortErrorByLine(bugreport);
        bugreportsArray.push(bugreport);
    });
    bugreports = {
        "bugreport" : bugreportsArray
    };
    fs.writeFile(projectPath + "Bug-Analysis-Report.json", JSON.stringify(bugreports, null, 2), function(){
        console.log(projectPath + "Bug-Analysis-Report.json");
        console.log("Generate Bug-Analysis-Report.json successfully");
    });
}

function getParenthesesStr(text) {
    text.match(/\((.+)\)/g);
    return RegExp.$1;
}

function getContent(str,firstStr,secondStr){
    if (str == "" || str == null || str == undefined){
        return "";
    }
    if (str.indexOf(firstStr)<0){
         return "";
    }
    var subFirstStr=str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
    if (secondStr == "") {
        return subFirstStr;
    } else {
        var subSecondStr=subFirstStr.substring(0, subFirstStr.indexOf(secondStr));
        return subSecondStr;
    }
}

function analyzePLError(partialLeak) {
    var array_1 = partialLeak.split("conditional free path:");
    var freePathArray = array_1.pop().split("\n"); 
    freePathArray.shift();
    var memoryAllocationString = getParenthesesStr(array_1[0]);
    var memoryAllocationLine = getContent(memoryAllocationString, "ln: ", " fl");
    var memoryAllocationPath = getContent(memoryAllocationString, "fl: ", "");
    var stackTrace = [];
    var crossOrigin = [];

    freePathArray.forEach(element => {
        var freePathName = getContent(element, "fl: ", ")");
        if (freePathName == memoryAllocationPath) {
            var freePathLine = getContent(element, "ln: ", " fl");
            var freePathEle = {
                "ln": Number(freePathLine),
                "Title": "Conditional free path"
            }
            stackTrace.push(freePathEle);
        } else {
            var freePathLine = getContent(element, "ln: ", " fl");
            var freePath = "";
            allFilesList.forEach(file => {
                if (file.endWith(freePathName)) {
                    freePath =file;
                }
            });
            freePath = freePath.substring(0, freePath.lastIndexOf("/"));
            var freePathEle = {
                "FileName": freePathName,
                "FilePath": freePath,
                "ln": Number(freePathLine)
            }
            crossOrigin.push(freePathEle);
        }
    });
    var error = {
        "ln": Number(memoryAllocationLine),
        "Type": "Semantic",
        "Occurrence": "Dynamic (Run-Time)",
        "Title": "PartialLeak",
        "Description": "Memory allocation",
        "StackTrace": stackTrace,
        "CrossOrigin": crossOrigin
    }
    error.Path = memoryAllocationPath;
    return error;
}

function analyzeNFError(neverFree) {
    var neverFreeLine = getContent(neverFree, "ln: ", " fl");
    var neverFreePath = getContent(neverFree, "fl: ", ")");
    var error = {
        "ln": Number(neverFreeLine),
        "Type": "Semantic",
        "Title": "NeverFree",
        "Occurrence": "Dynamic (Run-Time)",
        "Description": "memory allocation",
        "StackTrace": [],
        "CrossOrigin": []
    };
    error.Path = neverFreePath;
    return error;
}

function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        filesList.push(fullPath);
    });
    return filesList;
}

function unique (arr) {
    return Array.from(new Set(arr))
}

function readAllFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {      
            readFileList(path.join(dir, item), filesList);
        } else {                
            filesList.push(fullPath);                     
        }        
    });
    return filesList;
}

function sortErrorByLine(bugreport) {
    var errors = bugreport.Errors;
    for (let i = 0; i < errors.length - 1; i++) {
        for (let j = 0; j < errors.length - 1; j++) {
            if (errors[j].ln > errors[j + 1].ln) {
                var temp = errors[j];
                errors[j] = errors[j + 1];
                errors[j + 1] = temp;
            }
        }
    }
    bugreport.Errors = errors;
    return bugreport;
}
