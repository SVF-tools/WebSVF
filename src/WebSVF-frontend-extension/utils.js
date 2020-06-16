const vscode = require('vscode');
const fs = require('fs');
const request = require('request');
const extract = require('extract-zip'); //decompress zip files
var constants = require("./constants"); //Constants
var StatusBar = require("./statusBar"); //StatusBarItem
var os = require("os");
var path = require("path");
var ProgressBar = require('progress');

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

    let node_abspath = null;
    let platform = os.platform();
    if(platform == "win32"){
        node_abspath = os.userInfo().homedir + path.sep + constants.node_app; //node app absolute path.
    }else{
        node_abspath = constants.workspace.substring(0,constants.workspace.indexOf("/",6)+1) + constants.node_app //node app absolute path.
    }
    try{
        if(fs.existsSync(node_abspath)){
            //If the folder exists, then remove it.
            if(platform == "win32"){
                setStatusBar("Bug Analysis Tool: Initializing -> Cleaning", "Red");
                //terminal.sendText("# Removing the broken WebSVF-Frontend-Server, please wait...");
                //terminal.sendText(`rd/s/q "${node_abspath}"`); // Will replace the old one without warning.
            }else{
                setStatusBar("Bug Analysis Tool: Initializing -> Cleaning", "Red");
                //terminal.sendText("# Removing the broken WebSVF-Frontend-Server, please wait...");
                terminal.sendText("rm -rf "+node_abspath);
            }
            
        }

        // downloadFile(terminal, uri,node_abspath+".zip",function(){
        //     extractZip(node_abspath,terminal);
        // });
        var bar = new ProgressBar('progress: [:bar] :percent :elapsed'+'s', { total: 10, width: 5, complete: '█', incomplete: '░' });
        download(bar, uri, node_abspath+".zip",node_abspath, terminal);
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
function downloadFile(terminal, uri, destination, callback){
    //terminal.sendText("# Loading the WebSVF-Frontend-Server, please wait...");
    var stream = fs.createWriteStream(destination);
    request(uri).pipe(stream).on('close', callback);
}

function download(bar, uri, destination, node_abspath, terminal){
    setStatusBar("Bug Analysis Tool: Initializing -> Downloading", "Red");
    //terminal.sendText("# Loading the WebSVF-Frontend-Server, please wait...");
    var file_url = uri;
    //var file_url = 'https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/WebSVF-bug-report-fe.zip';
    var out = fs.createWriteStream(destination);

    var total;
    var progress = 0;

    var req = request({
        method: 'GET',
        uri: file_url
    });

    req.pipe(out);

    req.on('data', function (chunk) {
        // console.log('data')
        //console.log('data: '+ chunk.length);
        progress += chunk.length;
        if(total != 0){
            var currentProgress = (progress*100/total).toFixed(2);
            setStatusBar("Bug Analysis Tool: Initializing -> Downloading (" + currentProgress + "%)", "Red");
            bar.update(progress/total);
        }
        
    });

    req.on( 'response', function ( data ) {
        //console.log('response: ' + data.headers[ 'content-length' ] );
        total = data.headers[ 'content-length' ];
    } );

    req.on('error', function(data){
        console.log("Download failed! Please try again.");
    })

    req.on('end', function() {
        //Do something
        setStatusBar("Bug Analysis Tool: Initializing -> Extracting", "Red");
        extractZip(node_abspath,terminal);
    });
}

/**
 * 
 * @param {*} node_abspath 
 * @param {*} terminal 
 */
function extractZip(node_abspath,terminal){
    setStatusBar("Bug Analysis Tool: Initializing -> Extracting", "Red");
    //terminal.sendText("# Uncompressing the WebSVF-Frontend-Server, please wait...")
    extract(node_abspath+".zip", {dir: node_abspath}, function (err) {
        // extraction is complete. make sure to handle the err
        if(err){
            console.log(err.message);
        }else{
            terminal.sendText(`rm -r "${node_abspath}.zip"`);
            // let cfg_abspath = node_abspath + constants.node_branch + constants.config_abspath;
            // fs.writeFileSync(cfg_abspath,constants.workspace + constants.workspace_json);
            setStatusBar("Bug Analysis Tool: Initialized", "White");
            terminal.sendText("# Initialization finished, please click the 'Bug Analysis Tool' to generate the bug report!");
        }
    });
}

/**
 * cd to the node app folder and run the app.
 */
function bug_report(){
    //Get or Create a terminal
    let terminal = this.get_terminal("bug_report");
    let cfg_abspath = os.userInfo().homedir + path.sep + constants.node_app + constants.node_branch + constants.config_abspath;
    fs.writeFileSync(cfg_abspath,constants.workspace + constants.workspace_json);
    //cd to the folder
    //let node_abspath = constants.workspace.substring(0,constants.workspace.indexOf("/",6)+1)//node app absolute path.
    let node_branch = null;
    let platform = os.platform();
    if(platform == "win32"){
        node_branch = os.userInfo().homedir + path.sep + constants.node_app + constants.node_branch; //node app absolute path.
    }else{
        node_branch = constants.workspace.substring(0,constants.workspace.indexOf("/",6)+1) + constants.node_app + constants.node_branch; //node app absolute path.
    }
    terminal.sendText(`cd "${node_branch}"`);
    //Show commands in the terminal
    terminal.show(true);
    //Start the node app
    
    if(platform == "win32"){
        terminal.sendText("npm run start");
    }else{
        terminal.sendText("npm run start");
    }
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

function setStatusBar(text, color){
    StatusBar.statusBar.text = text;
    StatusBar.statusBar.color = color;
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

function terminal_stop(){
    if(panel!=null){
        panel.dispose();//CLose this webview.
        panel = null;//Reset the panel.
    }
}

module.exports = {
    get_terminal,
    init,
    downloadFile,
    extractZip,
    bug_report,
    open_internal_browser,
    setStatusBar,
    bug_report_stop,
    terminal_stop
}
