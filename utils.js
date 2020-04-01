const vscode = require('vscode');
const fs = require('fs');
const request = require('request');
const extract = require('extract-zip'); //decompress zip files
var constants = require("./constants"); //Constants

let panel =  null;//webview

/**
 * Create a terminal '_name' if it doesn't exist, or return the terminal '_name'
 * @param {*} _name 
 */
function get_terminal(_name){
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

/**
 * Initialize the workspace environment for the node app.
 * Delete node app folder if exists;
 * Download via the uri and decompress it and finally remove the file downloaded.
 * @param {*} uri 
 */
function init(uri){
    //Get or Create a terminal
    let terminal = this.get_terminal("bug_report");
    //Show commands in the terminal
    terminal.show(true);
    //Check if the folder has already existed
    let node_abspath = constants.workspace+"/"+constants.node_app; //node app absolute path.
    try{
        if(fs.existsSync(node_abspath)){
            //If the folder exists, then remove it.
            terminal.sendText("rm -rf "+constants.node_app);
        }

        downloadFile(uri,node_abspath+".zip",function(){
            extractZip(node_abspath,terminal);
        });
    }catch(e){
        //Show logs when exception occured
        let log = vscode.window.createOutputChannel('bug_report/log');
        log.show();
        log.appendLine("Download failed! Please try again.");
    }
}

/**
 * download file via uri to destination and callback another function when finishing download.
 * @param {*} uri 
 * @param {*} destination 
 * @param {*} callback 
 */
function downloadFile(uri,destination,callback){
    var stream = fs.createWriteStream(destination);
    request(uri).pipe(stream).on('close', callback);
}

/**
 * 
 * @param {*} node_abspath 
 * @param {*} terminal 
 */
function extractZip(node_abspath,terminal){
    extract(node_abspath+".zip", {dir: node_abspath}, function (err) {
        // extraction is complete. make sure to handle the err
        if(err){
            console.log(err.message);
        }else{
            terminal.sendText("rm -r "+constants.node_app+".zip");
            //terminal.sendText("cp -f Bug-Analysis-Report.json "+json_file);
            let cfg_abspath = constants.workspace + '/'+constants.node_app + constants.node_branch + constants.config_abspath;
            fs.writeFileSync(cfg_abspath,constants.workspace + constants.workspace_json);
        }
    });
}

/**
 * cd to the node app folder and run the app.
 */
function bug_report(){
    //Get or Create a terminal
    let terminal = this.get_terminal("bug_report");
    //cd to the folder
    terminal.sendText("cd " + constants.node_app + constants.node_branch);
    //Show commands in the terminal
    terminal.show(true);
    //Start the node app
    terminal.sendText("npm run start");
}

/**
 * Open an internal webview with uri in the right side of the VSCode.
 * @param {*} uri 
 */
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

/**
 * Cloes the webview, kill the port, dispose the terminal.
 */
function bug_report_stop(){
    if(panel!=null){
        panel.dispose();//CLose this webview.
        panel = null;//Reset the panel.
        let terminal = this.get_terminal("bug_report");//Get or Create a terminal
        terminal.show(true);//Show commands in the terminal
        terminal.dispose();//Dispose this terminal to stop
    }
}

module.exports = {
    get_terminal,
    init,
    downloadFile,
    extractZip,
    bug_report,
    open_internal_browser,
    bug_report_stop
}
