const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils'); //utils
var constants = require("./constants"); //Constants
var StatusBar = require("./statusBar"); //StatusBarItem
var os = require("os");
var path = require("path");
var net = require('net');
var script = require('./generateJsonForOneFIle.js');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function (context) {

    let timeInterval = null; //timeInterval for listening to when the port 3000 opened by the WebSVF frontend server.

    context.subscriptions.push(vscode.commands.registerCommand('extension.menu', function () {

        let workspace = vscode.workspace.rootPath; //Get the path of current workspace.
        // let workspace_json = workspace + constants.workspace_json; //workspace/Bug-Analysis-Report.json

        let c_path = vscode.window.activeTextEditor.document.fileName;//It is the location of single C or C++ file.
        let file_suffix = c_path.substring((c_path.lastIndexOf(".")+1), c_path.length);//Gets the suffix of the current open file.

        let svfPath = './bin/svf-ex -stat=false'; //'svfPath' is the path of svf bin folder and the analyze options(svf-ex -stat=false).

        let status = StatusBar.statusBar.text.split(": ")[1]; //Determine different situations via the text prompt of the status bar.

        //let node_abspath = null; //The path of WebSVF frontend server, which is also called bug analysis tool.
        let config_abspath = null; //The absolute path of config file in the WebSVF frontend server folder, which should be different in different OS.

        //Determine the Operating System, currently supports for Windows and Ubuntu.
        if (os.platform() == "win32") {//This is for Windows.
            config_abspath = os.userInfo().homedir + path.sep + constants.node_app + constants.node_branch + constants.config_abspath;
        } else {//This is for Ubuntu.
            if (typeof (constants.workspace) == "undefined") {
                vscode.window.showErrorMessage('No workplace opened, please open the target workplace!'); //Prompt users that no workplace opened yet.
                return;
            }
            let node_abspath = constants.workspace.substring(0, constants.workspace.indexOf(path.sep, 6) + 1) + constants.node_app; //The absolute path of the WebSVF frontend server.
            config_abspath = node_abspath + constants.config_abspath; //The absolute path of config file in the WebSVF frontend server folder.
        }

        //Perform different methods according to different circumstains.
        if (status == "Initializing") {
            //Display a message box for user to choose whether cancel initializing.
            vscode.window.showInformationMessage("Please wait a moment for initializing, do you want to stop?", "Yes", "No").then(selection => {
                if (selection == "Yes") {
                    stop();
                }
            });
        } else if (status == "Running") {
            //Display a message box for user to choose whether stop.
            vscode.window.showInformationMessage("Stop this 'Bug Analysis Tool'?", "Yes", "No").then(selection => {
                if (selection == "Yes") {
                    stop();
                }
            });
        } else if (isC_Cplusplus(file_suffix) && fs.existsSync(config_abspath)) {
            analysis(c_path, svfPath); //Start analysis when both the C or C++ file and config file exist.
        } else if (isC_Cplusplus(file_suffix) && !fs.existsSync(config_abspath)) {
            init(); //Start initializing the WebSVF frontend server if C or C++ exists, but config files misses.
        } else {
            //Display an error message box to the user when there is no test.json found.
            vscode.window.showErrorMessage('No C or C++ file opened in the workplace, the bug analysis tool cannot be actived!');
        }
    }));

    /**
     * Initialization if files or tools missing.
     */
    function init() {
        utils.setStatusBar("Bug Analysis Tool: Initializing", "Red"); //Update the text and color of the status bar for Bug Analysis Tool button.
        utils.init(constants.download_uri);//Download the zip, uncompress the zip locally to a specific hidden directory (the directory is consistent with the address downloaded by the WebSVF Backend script), and then remove the zip.
    }

    function analysis(c_path, svfPath) {

        script.generateJSONForOneFile(c_path, svfPath, function() {
            //if you want to do something when the process finished, add the code in this callback function.
            //console.log("success!");
            analysis_bugreport();
        });
    }

    /**
     * Start analysis when all elements prepared.
     * Will create a server to listen to port 3000 and open an internal webview inside the vscode.
     * More functions please refer to the readme of this extension.
     */
    function analysis_bugreport() {
        var server = net.createServer().listen(3000);//Create a server to listen to the port 3000.

        //It means that the WebSVF frontend server has been started successfully if the port 3000 has already been eaddrinused.
        server.on('error', function (err) {
            let flag = err.message.split(" ")[1];
            flag = flag.substring(0, flag.length - 1);

            if (flag === 'EADDRINUSE') { // The port has been occupied
                utils.setStatusBar("Bug Analysis Tool: Running", "Red");//Update the status bar.
                //utils.open_internal_browser("http://localhost:3000/");//Open a internal webview in the right side inside the vscode if eaddrinused.
                vscode.commands.executeCommand('browser-preview.openPreview','http://localhost:3000');//// Call another extension 'Browser Preview' and listen to localhost with port 3000.
            }
        });

        server.on('listening', function () { // Execution of this code indicates that the port is not occupied
            server.close(); // Close the service
            utils.setStatusBar("Bug Analysis Tool: Running", "Red");
            new Promise(function (resolve, reject) {
                utils.bug_report();//Send command via terminal to start the node app (WebSVF frontend server).
                resolve(1);
            }).then(function () {
                timeInterval = setInterval(function () { portIsOccupied(3000); }, 1000);//Check if the port 3000 has been started every one second.
            });
        });
    }

    function stop() {
        utils.setStatusBar("Bug Analysis Tool", "White");//Update the status bar.
        utils.bug_report_stop();//Stop the webview.
    }

    function portIsOccupied(port) {
        // Create the service and listen on the port
        var server = net.createServer().listen(port);

        server.on('listening', function () { // Execution of this code indicates that the port is not occupied
            server.close(); // Close the service
            //console.log('The port【' + port + '】 is available.');
        });

        server.on('error', function (err) {

            let flag = err.message.split(" ")[1];
            flag = flag.substring(0, flag.length - 1);

            if (flag === 'EADDRINUSE') { // The port has been occupied
                //console.log('The port【' + port + '】 is occupied, please change other port.');
                //utils.open_internal_browser("http://localhost:3000/");//Open a internal webview in the right side inside the vscode.
                vscode.commands.executeCommand('browser-preview.openPreview', 'http://localhost:3000'); // Call another extension 'Browser Preview' and listen to localhost with port 3000.
                clearInterval(timeInterval);//Close the check every one second if the WebSVF frontend server has been started.
            }
        });
    }

    function isC_Cplusplus(file_suffix){
        if(file_suffix.toLowerCase() == "c" || file_suffix.toLowerCase() == "cpp"){
            return true;
        }else{
            return false;
        }
    }

};