const vscode = require('vscode');
const fs = require('fs');
const request = require('request');
const extract = require('extract-zip')

let panel =  null;//webview
const folder = "WebSVF-bug-report-fe";
const json_file = "/WebSVF-bug-report-fe/Bug-Analysis-Report.json";
const node_app_folder = "node-scripts/"

function create_terminal(_name){
    var flag = true;//To determine a terminal if it has the same '_name'.
    var terminals = vscode.window.terminals;//Array of all the terminals.
    var terminal;//To choose a terminal with the same '_name'.
    terminals.forEach(element => {
        if(element.name == _name){
            flag = false;
            terminal = element;
            return;
        }
    }); 
    //return the terminal with '_name'. Create a new terminal with '_name' if it doesn't exist.
    if(flag){
        return vscode.window.createTerminal({name:_name});
    }else{
        return terminal;
    }
}

function git_clone(uri){
    //Get or Create a terminal
    let terminal = this.create_terminal("bug_report");
    //Show commands in the terminal
    terminal.show(true);

    //Check if the folder has already existed
    let folder_path = vscode.workspace.rootPath+"/"+folder;
    
    try{
        if(fs.existsSync(folder_path)){
            //If the folder exists, then remove it.
            terminal.sendText("rm -rf "+folder);
        }

        downloadFile(uri,folder_path+".zip",function(){
            extractZip(vscode.workspace.rootPath,terminal);
        });
    }catch(e){
        //Show logs when exception occured
        let log = vscode.window.createOutputChannel("bug_report/log");
        log.show();
        log.appendLine("Git Clone failed! Please try again.");
    }
}

function downloadFile(uri,destination,callback){
    var stream = fs.createWriteStream(destination);
    request(uri).pipe(stream).on('close', callback);
}

function extractZip(folder_path,terminal){
    extract(folder_path+"/"+folder+".zip", {dir: folder_path}, function (err) {
        // extraction is complete. make sure to handle the err
        if(err){
            console.log(err.message);
            //terminal.sendText("rm -rf "+folder);
        }else{
            terminal.sendText("rm -r "+folder+".zip");
            //terminal.sendText("cp -f Bug-Analysis-Report.json "+json_file);
        }
    });
}

function bug_report(){
    //Get or Create a terminal
    let terminal = this.create_terminal("bug_report");
    //cd to the folder
    terminal.sendText("cd "+folder);
    //Show commands in the terminal
    terminal.show(true);
    //Start the node app
    terminal.sendText("node "+node_app_folder+"test.js");
}

function open_internal_browser(uri){
    panel = vscode.window.createWebviewPanel(
        'Bug Report',
        'Bug Report',
        vscode.ViewColumn.Two,
        {
            enableScripts: true, //Enable JS, defual disable
            retainContextWhenHidden: true, //To avoid being reset. Remain this webview when hidden. 
        }
    );
    // And set its HTML content
    panel.webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Bug Report</title>
    </head>
    <style>
        body, html
        {
            margin: 0; padding: 0; height: 100%; overflow: hidden;
        }
        .vscode-light {
            background: #fff;
        }
    </style>
    <body>
        <iframe id="myiframe" class="vscode-light" src="`+uri+`" width="100%" height="1000px" frameborder="0"></iframe>
    </body>
    </html>`;
}

function bug_report_stop(){
    if(panel!=null){
        panel.dispose();//CLose this webview.
        panel = null;//Reset the panel.
        let terminal = this.create_terminal("bug_report");//Get or Create a terminal
        terminal.show(true);//Show commands in the terminal
        terminal.dispose();//Dispose this terminal to stop
    }
}

module.exports = {
    create_terminal,
    git_clone,
    downloadFile,
    extractZip,
    bug_report,
    open_internal_browser,
    bug_report_stop
}
