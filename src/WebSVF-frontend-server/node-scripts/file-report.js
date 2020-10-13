//Loading Required Node Modules
const fs = require("fs"); //File Reader/Writer Library
var jsdom = require("jsdom"); //JSDOM library for emulating DOM in NodeJS
const jquery = require("jquery"); //jQuery Library for NodeJS
const path = require("path");

// file_tracker => Files Tracker

const gen_file_report = (file_tracker) => {

    //Reading Static Web Page File
    var web_page = fs.readFileSync(path.join(__dirname,"/../public/fileReport.html")).toString();

    //Reading Bug-Analysis-Report.json containing Error Information
    //const json_relativePath = fs.readFileSync(path.join(__dirname,'/../config/bug-analysis-JSON_relative-dir.config'),'utf8');
    const json_absolutePath = fs.readFileSync(path.join(__dirname,'/../config/bug-analysis-JSON_absolute-dir.config'),'utf8');

    var jsonString;

    if(json_absolutePath.length!=0){
        jsonString = fs.readFileSync(json_absolutePath,'utf8');
    }
    else{
        jsonString = fs.readFileSync(path.join(__dirname,`/../test_files/Bug-Analysis-Report.json`),'utf8');
    }
    
    jsonString = JSON.parse(jsonString);

    //Create Virtual DOM for NodeJS for the input Web Page (.html) file
    const dom = new jsdom.JSDOM(web_page);

    //Invoke jQuery on the created Virtual DOM window 
    const $ = jquery(dom.window);

    var error_tracker = 0;//Errors tracker per file

    var fileP = jsonString.bugreport[file_tracker].FilePath + '/' + jsonString.bugreport[file_tracker].FileName; //File Path of the current .c file being reported

    //Reading Code (.c) File
    var codeString = fs.readFileSync(fileP).toString();

    //Replace "<" and ">" characters in the c file with HTML parsable conterparts
    codeString = codeString.replace("<","&lt;");
    codeString = codeString.replace(">","&gt;");
    codeString = codeString.replace(/(\r\n|\n|\r)/gm,"\n");

    //Store the code in the .c file in a String array
    //For inserting code into the html file line by line
    var string1 = codeString.toString().split("\n");

    /*Variable in which the final C code (as a String) with be stored 
    to be displayed in the bugreport html */
    var codeStringSerialised = '';

    //Initialise leader-lines JSON arrays for errors and error-reference
    var ll_array = [];
    var ll_ref_array = [];
    var ll_stacktrace_array = [];


    for (let i = 0; i < string1.length; i++) {

        //Initialise JSON objects used for populating error and error-reference leader-lines JSON arrays
        var ll_obj = {};
        var ll_ref = {};
        var ll_stacktrace = {};

        //Initialize Variables storing values from Bug-Analysis-Report.json for the current file (file_tracker)
        var err_ln = jsonString.bugreport[file_tracker].Errors[error_tracker].ln;
        var err_type = jsonString.bugreport[file_tracker].Errors[error_tracker].Type;
        var err_name = jsonString.bugreport[file_tracker].Errors[error_tracker].Title;
        var err_descr = jsonString.bugreport[file_tracker].Errors[error_tracker].Description;

        

        if(string1[i].length>50){

            var after_line = string1[i];
            var len = string1[i].length;
            const len_c = len;
            string1[i] = '';

            while(len!=0){

                const splitSpace_firstHalf = after_line.substring(40,45).indexOf(' ');
                const splitSpace_secondHalf = after_line.substring(45,50).indexOf(' ');

                if(splitSpace_secondHalf!=-1){
                    if(len==len_c){
                        string1[i] += after_line.substring(0,45+splitSpace_secondHalf);
                        len -= after_line.substring(0,45+splitSpace_secondHalf).length;
                        after_line = after_line.substring(45+splitSpace_secondHalf,after_line.length);
                    }
                    else{
                        string1[i] += '<br class="nocode"/>       ' + after_line.substring(0,45+splitSpace_secondHalf);
                        len -= after_line.substring(0,45+splitSpace_secondHalf).length;
                        after_line = after_line.substring(45+splitSpace_secondHalf,after_line.length);
                    }
                }
                else if(splitSpace_firstHalf!=-1){
                    if(len==len_c){
                        string1[i] += after_line.substring(0,40+splitSpace_firstHalf);
                        len -= after_line.substring(0,40+splitSpace_firstHalf).length;
                        after_line = after_line.substring(40+splitSpace_firstHalf,after_line.length);
                    }
                    else{
                        string1[i] += '<br class="nocode"/>       ' + after_line.substring(0,40+splitSpace_firstHalf);
                        len -= after_line.substring(0,40+splitSpace_firstHalf).length;
                        after_line = after_line.substring(40+splitSpace_firstHalf,after_line.length);
                    }                    
                }
                else if(len>50 && len<100){
                    if(len==len_c){
                        string1[i] += after_line.substring(0,50);
                        len -= 50;
                        after_line = after_line.substring(50,after_line.length);
                    }
                    else{
                        string1[i] += '<br class="nocode"/>       ' + after_line.substring(0,50);
                        len -= 50;
                        after_line = after_line.substring(50,after_line.length);
                    }                    
                }

                if(after_line.length<=50){
                    string1[i] += '<br class="nocode"/>       ' + after_line;
                    len -= after_line.length;
                }
                
            }
        }

        //Add ShowLines Button to the HTML file
        if(i==0) {
            codeStringSerialised += `<a class="code-body" id="${(i+1)}">${string1[i]}</a>\n`;
        }
        else if(err_ln==(i+1)){     //Checking if there is an error at the .c line being added to the html file

                
            /** 
                function nthIndex(str, pat, n){
                    var L= str.length, i= -1;
                    while(n-- && i++<L){
                        i= str.indexOf(pat, i);
                        if (i < 0) break;
                    }
                    return i;
                }
                */

                //Shorten Error Name for FileReport's Error Bubbles
                if(err_name.length>25){

                    const splitSpace_firstHalf = err_name.substring(20,25).indexOf(' ');
                    const splitSpace_secondHalf = err_name.substring(25,30).indexOf(' ');
                    if(splitSpace_secondHalf!=-1){
                        err_name = err_name.substring(0,25+splitSpace_secondHalf) + '\n' + err_name.substring(25+splitSpace_secondHalf, err_name.length);
                    }
                    else if(splitSpace_firstHalf!=-1){
                        err_name = err_name.substring(0,20+splitSpace_firstHalf) + '\n' + err_name.substring(20+splitSpace_firstHalf, err_name.length);
                    }
                    else if(err_name.length<30){
                        err_name = err_name.substring(0,24) + '\n-' + err_name.substring(24, err_name.length);
                    }
                    else{
                        err_name = err_name.substring(0,29) + '\n-' + err_name.substring(29, err_name.length);
                    }
                }

                //Shorten Error Description for FileReport's Error Bubbles
                if(err_descr.length>25){

                    const splitSpace_firstHalf = err_descr.substring(20,25).indexOf(' ');
                    const splitSpace_secondHalf = err_descr.substring(25,30).indexOf(' ');
                    if(splitSpace_secondHalf!=-1){
                        err_descr = err_descr.substring(0,25+splitSpace_secondHalf) + '\n' + err_descr.substring(25+splitSpace_secondHalf, err_descr.length);
                    }
                    else if(splitSpace_firstHalf!=-1){
                        err_descr = err_descr.substring(0,20+splitSpace_firstHalf) + '\n' + err_descr.substring(20+splitSpace_firstHalf, err_descr.length);
                    }
                    else if(err_descr.length<30){
                        err_descr = err_descr.substring(0,24) + '\n' + '-' + err_descr.substring(24, err_descr.length);
                    }
                    else{
                        err_descr = err_descr.substring(0,29) + '\n'+'-' + err_descr.substring(29, err_descr.length);
                    }
                }

                if(err_descr.length>50){
                    err_descr = err_descr.substring(0,50) + '...';
                }

                if(err_name.length>40){
                    err_name = err_name.substring(0,40) + '...';
                }
            
            //Check for Error Type and Insert Error at the correct line number 
            if(err_type==='Syntax'){
                codeStringSerialised += `<div class="err-line"><span id="err${error_tracker}" class="alert-syntax nocode"><button id="${error_tracker}*!*err" onclick="add_errLines(${error_tracker})" class="err-button">${err_name}</button>\n<a>${err_descr}</a></span><a class="code-body" id="${(i+1)}">${string1[i]}</a></div>\n`;
                if(!$.isEmptyObject(jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace)){
                    ll_stacktrace['ln'] = (i+1);
                    ll_stacktrace['type'] = err_type;
                    ll_stacktrace['StackTrace'] = jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace;
                    ll_stacktrace_array.push(ll_stacktrace);
                }
            } else if(err_type==='Logical'){
                codeStringSerialised += `<div class="err-line"><span id="err${error_tracker}" class="alert-logical nocode"><button id="${error_tracker}*!*err" onclick="add_errLines(${error_tracker})" class="err-button">${err_name}</button>\n<a>${err_descr}</a></span><a class="code-body" id="${(i+1)}">${string1[i]}</a></div>\n`;
                if(!$.isEmptyObject(jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace)){
                    ll_stacktrace['ln'] = (i+1);
                    ll_stacktrace['type'] = err_type;
                    ll_stacktrace['StackTrace'] = jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace;
                    ll_stacktrace_array.push(ll_stacktrace);
                }
            } else if(err_type==='Semantic'){
                codeStringSerialised += `<div class="err-line"><span id="err${error_tracker}" class="alert-semantic nocode"><button id="${error_tracker}*!*err" onclick="add_errLines(${error_tracker})" class="err-button">${err_name}</button>\n<a>${err_descr}</a></span><a class="code-body" id="${(i+1)}">${string1[i]}</a></div>\n`;
                if(!$.isEmptyObject(jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace)){
                    ll_stacktrace['ln'] = (i+1);
                    ll_stacktrace['type'] = err_type;
                    ll_stacktrace['StackTrace'] = jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace;
                    ll_stacktrace_array.push(ll_stacktrace);
                }
            } else {
                codeStringSerialised += `<div class="err-line"><span id="err${error_tracker}" class="alert nocode"><button id="${error_tracker}*!*err" onclick="add_errLines(${error_tracker})" class="err-button">${err_name}</button>\n<a>${err_descr}</a></span><a class="code-body" id="${(i+1)}">${string1[i]}</a></div>\n`;
                if(!$.isEmptyObject(jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace)){
                    ll_stacktrace['ln'] = (i+1);
                    ll_stacktrace['type'] = err_type;
                    ll_stacktrace['StackTrace'] = jsonString.bugreport[file_tracker].Errors[error_tracker].StackTrace;
                    ll_stacktrace_array.push(ll_stacktrace);
                }
            }

            //Populate Separate JSON Array for Error Reference Lines
            ll_ref['start'] = 'err'+error_tracker;
            ll_ref['end'] = err_ln;
            ll_ref_array.push(ll_ref);

            //Checking for Overflow on the counter error_tracker
        const ers_length = Object.keys(jsonString.bugreport[file_tracker].Errors)
        .length;

            if(error_tracker<ers_length-1){
                
                /*
                Populate Leader-Lines JSON Array containing start and end positions
                of the lines
                Start of the line is set to the current error in the Bug-Analysis-Report.json file
                End of the line is set to the next error in the Bug-Analysis-Report.json file
                */
                ll_obj['start'] = err_ln;
                ll_obj['end'] = jsonString.bugreport[file_tracker].Errors[(error_tracker+1)].ln;
                ll_array.push(ll_obj);

                //Increment Error Index to the next error
                ++error_tracker;
            }
        }
        else    {
            if(i!=(string1.length-1))
            codeStringSerialised += '<a class="code-body" id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
            else
            codeStringSerialised += '<a class="code-body" id="'+(i+1)+'">'+string1[i]+'</a>';
        }
    }

    //jQuery HTML Manipulation
    $("#test").html(codeStringSerialised);
    $("#heading").html(jsonString.bugreport[file_tracker].FileName);
    /* Code for the Leader-Lines function is stored as a string in a text file
    The code is read into a variable and added in the correct format and order 
    into the bug_report html file*/
    //var leader_lines_function = fs.readFileSync('code_snippets/leader-line_pseudo_code.js','utf8')


    /*  First  'var lines ='+JSON.stringify(obj)+' => adds the JSON array containing 
    the line numbers for the Leader-Lines into the html file
    Followed by added the pseduo code for Leader-Lines function defined earlier */
    $("#LeaderLines").html(`\n${'\t'.repeat(2)}var ref_lines =${JSON.stringify(ll_ref_array)};\n${'\t'.repeat(2)}var lines =${JSON.stringify(ll_array)};\n${'\t'.repeat(2)}var stacktrace_array =${JSON.stringify(ll_stacktrace_array)};\n${'\t'.repeat(2)}var file_id = ${file_tracker}`);


    /*Write changes from the Virtual DOM to the Web Page (.html)
    file to be loaded by the ExpressJS WebServer */
    fs.writeFileSync(path.join(__dirname,"/../public/fileReport.html"), dom.serialize());
} 

module.exports = {
    generate: gen_file_report
  };