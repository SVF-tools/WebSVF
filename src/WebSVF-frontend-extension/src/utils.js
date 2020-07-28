const vscode = require('vscode');
const fs = require('fs');
const request = require('request');
const extract = require('extract-zip'); //decompress zip files
var constants = require("./constants"); //Constants
var StatusBar = require("./statusBar"); //StatusBarItem
var os = require("os");
var path = require("path");
var ProgressBar = require('progress');


let panel = null;//webview

/**
 * Create a terminal '_name' if it doesn't exist, or return the terminal '_name'.
 * @param {*} _name the name of the terminal.
 */
function get_terminal(_name) {
    var flag = true;//To determine a terminal if it has the same '_name'.
    var terminals = vscode.window.terminals;//Get the array of all the terminals.
    var terminal;//To choose a terminal with the same '_name'.
    terminals.forEach(element => {
        if (element.name == _name) {
            flag = false;
            terminal = element; //Get the terminal with the name of '_name'.
            return; //Break the forEach loop and execute the following methods if get the correct terminal.
        }
    });
    //return the terminal with '_name'. Create a new terminal with '_name' if it doesn't exist.
    if (flag) {
        return vscode.window.createTerminal({ name: _name });
    } else {
        return terminal;
    }
}

/**
 * Initialization method.
 * Initialize the workspace environment for the node app (WebSVF frontend server).
 * Delete node app folder if exists;
 * Download via the uri and decompress it and finally remove the file downloaded.
 * @param {*} uri 
 */
function init(uri) {
    //Get or Create a terminal
    let terminal = this.get_terminal("bug_report");
    //Show commands in the terminal
    terminal.show(true);
    //Check if the folder has already existed

    let node_abspath = null; //Node app (WebSVF frontend server) absolute path.
    let platform = os.platform(); //Detect the operating system.
    if (platform == "win32") {
        node_abspath = os.userInfo().homedir + path.sep + constants.node_app; //Node app (WebSVF frontend server) absolute path.
    } else {
        node_abspath = constants.workspace.substring(0, constants.workspace.indexOf("/", 6) + 1) + constants.node_app //Node app (WebSVF frontend server) absolute path.
    }
    try {
        if (fs.existsSync(node_abspath)) {
            //If the folder exists, then remove it.
            if (platform == "win32") {
                setStatusBar("Bug Analysis Tool: Initializing -> Cleaning", "Red"); //Update the status bar.
            } else {
                setStatusBar("Bug Analysis Tool: Initializing -> Cleaning", "Red"); //Update the status bar.
                terminal.sendText("rm -rf " + node_abspath); //Remove the folder in Linux. No need to remove the folder in windows, since it would be replaced automatically.
            }

        }

        var bar = new ProgressBar('progress: [:bar] :percent :elapsed' + 's', { total: 10, width: 5, complete: '█', incomplete: '░' });
        download(bar, uri, node_abspath + ".zip", node_abspath, terminal); //Download the WebSVF frontend server into the specific hidden folder in the format of zip with progress detection.
    } catch (e) {
        //Show logs when exception occured
        let log = vscode.window.createOutputChannel('bug_report/log');
        log.show();
        log.appendLine("Download failed! Please try again.");
    }

}

/**
 * Initialization method.
 * Download file via uri to destination and callback another function when finishing download.
 * Currently this function is discarded. The download function takes place of this function.
 * @param {*} uri download uri
 * @param {*} destination the absolute path with the zip name. For instance, xxx/yyy/www.zip
 * @param {*} callback 
 */
function downloadFile(terminal, uri, destination, callback) {
    var stream = fs.createWriteStream(destination);
    request(uri).pipe(stream).on('close', callback);
}

/**
 * Initialization method.
 * Download the WebSVF frontend server into the specific hidden folder in the format of zip with progress detection.
 * @param {*} bar downloading progress detection
 * @param {*} _uri download uri
 * @param {*} destination the absolute path with the zip name. For instance, xxx/yyy/www.zip
 * @param {*} node_abspath destination folder, the specific hidden folder for WebSVF frontend server.
 * @param {*} terminal 
 */
function download(bar, _uri, destination, node_abspath, terminal) {
    setStatusBar("Bug Analysis Tool: Initializing -> Downloading", "Red"); //Update the status bar.

    var out = fs.createWriteStream(destination);

    //Progress detection elements.
    var total;
    var progress = 0;

    var req = request({
        method: 'GET',
        uri: _uri
    });

    req.pipe(out);

    req.on('data', function (chunk) {
        // console.log('data')
        //console.log('data: '+ chunk.length);
        progress += chunk.length;
        if (total != 0) {
            var currentProgress = (progress * 100 / total).toFixed(2);
            setStatusBar("Bug Analysis Tool: Initializing -> Downloading (" + currentProgress + "%)", "Red"); //Update the status bar with downloading progress prompt.
            //bar.update(progress/total);
        }

    });

    req.on('response', function (data) {
        //console.log('response: ' + data.headers[ 'content-length' ] );
        total = data.headers['content-length']; //Get the total size of the WebSVF frontend server (zip).
    });

    req.on('error', function (data) {
        console.log("Download failed! Please try again.");
    })

    req.on('end', function () {
        setStatusBar("Bug Analysis Tool: Initializing -> Extracting", "Red"); //Update the status bar.
        extractZip(node_abspath, terminal); //Extract the zip into the specific hidden folder for the WebSVF frontend server when downloading finished.
    });
}

/**
 * Initialization method.
 * @param {*} node_abspath destination folder, the specific hidden folder for WebSVF frontend server.
 * @param {*} terminal 
 */
function extractZip(node_abspath, terminal) {
    setStatusBar("Bug Analysis Tool: Initializing -> Extracting", "Red"); //Update the status bar.
    extract(node_abspath + ".zip", { dir: node_abspath }, function (err) {
        // extraction is complete. make sure to handle the err
        if (err) {
            console.log(err.message);
        } else {
            terminal.sendText(`rm -r "${node_abspath}.zip"`); //If the zip can be extracted successfully, then remove the zip.
            setStatusBar("Bug Analysis Tool: Initialized", "White"); //Update the status bar.
            terminal.sendText("# Initialization finished, please click the 'Bug Analysis Tool' to generate the bug report!"); //Send prompt in terminal to indicate users the initialization finished.
        }
    });
}

/**
 * Start the node app (WebSVF frontend server).
 * cd to the node app (WebSVF frontend server) folder and run the app.
 */
function bug_report() {
    let terminal = this.get_terminal("bug_report"); //Get or Create a terminal
    let cfg_abspath = os.userInfo().homedir + path.sep + constants.node_app + constants.config_abspath; //Get the absolute path of the configuration file in the WebSVF frontend server.
    fs.writeFileSync(cfg_abspath, constants.workspace + constants.workspace_json); //Write into the configuration file with the absolute path of the json file in the workspace.

    let node_abspath = null; //The absolute path of the WebSVF frontend server.
    let platform = os.platform(); //Detect the operating system.
    if (platform == "win32") {
        node_abspath = os.userInfo().homedir + path.sep + constants.node_app + constants.node_branch; //The absolute path of the WebSVF frontend server.
    } else {
        node_abspath = constants.workspace.substring(0, constants.workspace.indexOf("/", 6) + 1) + constants.node_app; //The absolute path of the WebSVF frontend server.
    }

    terminal.sendText(`cd "${node_abspath}"`); //cd the path.

    terminal.show(true); //Show commands in the terminal.
    terminal.sendText("npm run start"); //Start the node app (WebSVF frontend server). Commands are same across the Windows and Unbutu.
}

/**
 * Start the node app (WebSVF frontend server).
 * Open an internal webview with uri in the right side of the VSCode.
 * @param {*} uri 
 */
function open_internal_browser(uri) {
    uri = "https://www.google.com/" //Only for test. It should work if google can be connected.
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
        <h1>It works, but why is the connection refused???</h1>
        <iframe id="myiframe" class="vscode-light" src=${uri} width="100%" height="1000px" frameborder="0"></iframe>
    </body>
    </html>`;
}

/**
 * Stop the node app (WebSVF frontend server).
 * Cloes the webview, kill the port, and dispose the terminal.
 */
function bug_report_stop() {
    let terminal = this.get_terminal("bug_report");//Get or Create a terminal
    if (terminal != null) {
        // panel.dispose();//Close this webview.
        // panel = null;//Reset the panel.
        terminal.show(true);//Show commands in the terminal
        terminal.dispose();//Dispose this terminal to stop
    }
}

/**
 * Stop the node app (WebSVF frontend server) when users kill the terminal manually.
 * Close the webview inside the vscode and reset the panel. Do not kill the terminal.
 */
function panel_dispose() {
    if (panel != null) {
        panel.dispose();//Close this webview.
        panel = null;//Reset the panel.
    }
}


/**
 * Update the status bar for the button of the bug analysis tool.
 * @param {*} text Update the text of the status bar.
 * @param {*} color Update the color of the stauts bar.
 */
function setStatusBar(text, color) {
    StatusBar.statusBar.text = text;
    StatusBar.statusBar.color = color;
}

module.exports = {
    get_terminal, //Create a terminal if it doesn't exist, or return the target terminal.
    init, //Initialization method.
    downloadFile, //Initialization method.
    download, //Initialization method.
    extractZip, //Initialization method.
    bug_report, //Start the node app (WebSVF frontend server).
    open_internal_browser, //Start the node app (WebSVF frontend server).
    bug_report_stop, //Stop the node app (WebSVF frontend server).
    panel_dispose, //Stop the node app (WebSVF frontend server) when users kill the terminal manually.
    setStatusBar //Update the status bar for the button of the bug analysis tool.
}