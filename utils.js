const vscode = require('vscode');
const fs = require('fs');

let panel =  null;//webview
const folder = "WebSVF";

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
    //The name of the folder which is cloned from the remote git.
    let folder_name = uri.split(".git")[0];
    folder_name = folder_name.substring(folder_name.lastIndexOf("/")+1);
    
    //Get or Create a terminal
    let terminal = this.create_terminal("bug_report");
    //Show commands in the terminal
    terminal.show(true);

    //Check if the folder has already existed
    let folder_path = vscode.workspace.rootPath+"/"+folder_name;
    
    try{
        if(fs.existsSync(folder_path)){
            //If the folder exists, then remove it.
            terminal.sendText("rm -rf "+folder);
        }
        //Send command to terminal to git clone
        terminal.sendText("git clone -b bug-report-fe "+uri); 
        terminal.sendText("cp -f test.json "+folder+"/test.json");
    }catch(e){
        //Show logs when exception occured
        let log = vscode.window.createOutputChannel("bug_report/log");
        log.show();
        log.appendLine("Git Clone failed! Please try again.");
    }
}

function bug_report(){
    //Get or Create a terminal
    let terminal = this.create_terminal("bug_report");
    //cd to the folder
    terminal.sendText("cd "+folder);
    //Show commands in the terminal
    terminal.show(true);
    //Start the node app
    terminal.sendText("node test.js");
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

    panel.webview.onDidReceiveMessage(message => {
        console.log('插件收到的消息：', message);
    }, undefined, undefined);
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
    bug_report,
    open_internal_browser,
    bug_report_stop
}