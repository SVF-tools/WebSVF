//ExpressJS config
const express = require("express");
const app = express();
const port = 3000;
app.use(express.static(__dirname));

/* 

npm i express
npm i jsdom
npm i jquery

*/

//Loading Required Node Modules
const fs = require("fs"); //File Reader/Writer Library
var jsdom = require("jsdom"); //JSDOM library for emulating DOM in NodeJS
const jquery = require("jquery"); //jQuery Library for NodeJS
const open = require('open');//Open website in default browser;


//Reading Static Web Page File
var web_page = fs.readFileSync("./public/index.html").toString();

//Reading Test.json containing Error Information
var jsonString = JSON.parse(fs.readFileSync('test.json','utf8'));

//Initialise Trackers for .c files containing errors
var file_tracker = 0; //Files Tracker
var error_tracker = 0;//Errors tacker per file

var fileP = jsonString.bugreport[file_tracker].FilePath; //File Path of the current .c file being reported

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

for (let i = 0; i < string1.length; i++) {

    //Initialise JSON objects used for populating error and error-reference leader-lines JSON arrays
    var ll_obj = {};
    var ll_ref = {};

    //Initialize Variables storing values from Test.json for the current file (file_tracker)
    var err_ln = jsonString.bugreport[file_tracker].Errors[error_tracker].ln;
    var err_type = jsonString.bugreport[file_tracker].Errors[error_tracker].Type;
    var err_name = jsonString.bugreport[file_tracker].Errors[error_tracker].Error;
    var err_descr = jsonString.bugreport[file_tracker].Errors[error_tracker].Description;

    //Add ShowLines Button to the HTML file
    if(i==0) {
        codeStringSerialised += '<button class="button nocode" onClick="showLines()">'+'Show Lines'+'</button>'+'<a id="'+(i+1)+'">'+string1[i]+'</a> \n';
    }
    else if(err_ln==(i+1)){     //Checking if there is an error at the .c line being added to the html file

        //Check for Error Type and Insert Error at the correct line number 

        if(err_type==='Syntax'){
            codeStringSerialised += '<span id="err'+error_tracker+'" class="alert-syntax nocode">'+err_name+'\n<a>'+err_descr+'</a></span>'+'<a id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
        } else if(err_type==='Compile'){
            codeStringSerialised += '<span id="err'+error_tracker+'" class="alert-compile nocode">'+err_name+'\n<a>'+err_descr+'</a></span>'+'<a id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
        } else if(err_type==='Runtime'){
            codeStringSerialised += '<span id="err'+error_tracker+'" class="alert-runtime nocode">'+err_name+'\n<a>'+err_descr+'</a></span>'+'<a id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
        } else {
            codeStringSerialised += '<span id="err'+error_tracker+'" class="alert nocode">'+err_name+'\n<a>'+err_descr+'</a></span>'+'<a id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
        }

        //Populate Separate JSON Array for Error Reference Lines
        ll_ref['start'] = 'err'+error_tracker;
        ll_ref['end'] = err_ln;
        ll_ref_array.push(ll_ref);

        //Checking for Overflow on the counter error_tracker
        if(error_tracker<(jsonString.bugreport[file_tracker].Errors.length-1)){
            
            /*Populate Leader-Lines JSON Array containing start and end positions
            of the lines
            Start of the line is set to the current error in the test.json file
            End of the line is set to the next error in the test.json file*/
            ll_obj['start'] = err_ln;
            ll_obj['end'] = jsonString.bugreport[file_tracker].Errors[(error_tracker+1)].ln;
            ll_array.push(ll_obj);

            //Increment Error Index to the next error
            ++error_tracker;
        }
    }
    else    {
        if(i!=(string1.length-1))
        codeStringSerialised += '<a id="'+(i+1)+'">'+string1[i]+'</a>'+"\n";
        else
        codeStringSerialised += '<a id="'+(i+1)+'">'+string1[i]+'</a>';
    }
}

//Create Virtual DOM for NodeJS for the input Web Page (.html) file
const dom = new jsdom.JSDOM(web_page);

//Invoke jQuery on the created Virtual DOM window 
const $ = jquery(dom.window);

//jQuery HTML Manipulation
$("#test").html(codeStringSerialised);

/* Code for the Leader-Lines function is stored as a string in a text file
The code is read into a variable and added in the correct format and order 
into the bug_report html file*/
var leader_lines_function = fs.readFileSync('code_snippets/leader-line_pseudo_code.txt','utf8')


/*  First  'var lines ='+JSON.stringify(obj)+' => adds the JSON array containing 
the line numbers for the Leader-Lines into the html file
Followed by added the pseduo code for Leader-Lines function defined earlier */
$("#LeaderLines").html(('\n\t\t'+'var ref_lines ='+JSON.stringify(ll_ref_array)+';')+('\n\t\t'+'var lines ='+JSON.stringify(ll_array)+';')+'\n\t\t'+leader_lines_function);


/*Write changes from the Virtual DOM to the Web Page (.html)
file to be loaded by the ExpressJS WebServer */
fs.writeFileSync("./public/index.html", dom.serialize());

//Serving Static Web Page using ExpressJS
app.use(express.static("public"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
open('http://localhost:3000');