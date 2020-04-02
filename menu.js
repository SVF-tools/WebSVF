const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils'); //utils
var constants = require("./constants"); //Constants
var StatusBar = require("./statusBar"); //StatusBarItem
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.menu', function () {
        let workspace = vscode.workspace.rootPath;
        let workspace_json = workspace + constants.workspace_json; //workspace/Bug-Analysis-Report.json
        let status = StatusBar.statusBar.text.split(": ")[1];
        
        let node_abspath = constants.workspace.substring(0,constants.workspace.indexOf("/",6)+1) + constants.node_app//node app absolute path.
        
        let config_abspath = node_abspath + constants.node_branch + constants.config_abspath;
        
        if(status == "Initializing"){
            vscode.window.showInformationMessage("Please wait a moment for initializing");
        }else if(status == "Running"){
            vscode.window.showInformationMessage("Stop this 'Bug Analysis Tool'?", "Yes", "No").then(selection => {//Display a message box for user to choose.
                if(selection == "Yes"){
                    stop();
                }
            });
        }else if (fs.existsSync(workspace_json) && fs.existsSync(config_abspath)) {
            vscode.window.showInformationMessage("Please select an option:", "Report Init", "Report Analysis").then(selection => {//Display a message box for user to choose.
                if(selection == "Report Init"){
                    init();
                }else if(selection == "Report Analysis"){
                    analysis();
                }
            });
        }else if(fs.existsSync(workspace_json) && !fs.existsSync(config_abspath)){
            vscode.window.showInformationMessage("Missing necessary files, do you want to load the 'Bug Analysis Tool'?", "Yes", "No").then(selection => {//Display a message box for user to choose.
                if(selection == "Yes"){
                    init();
                }
            });
        }else{
            //Display an error message box to the user when there is no test.json found.
            vscode.window.showErrorMessage('No Bug-Analysis-Report.json found in the workplace, the bug_report plugin cannot be actived!');
        }
    }));


    function init(){
        utils.setStatusBar("Bug Analysis Tool: Initializing", "Red");
        utils.init(constants.download_uri);//Download the zip, unzip it to a folder and then remove the zip.
    }

    function analysis(){
        utils.setStatusBar("Bug Analysis Tool: Running", "Red");
        new Promise(function (resolve, reject) {                
            utils.bug_report();//Send command via terminal to start the node app.
            resolve();
        }).then(function () {
            setTimeout(function () {
                utils.open_internal_browser("http://localhost:3000/");//Open a internal webview in the right side.
              }, 5000);
        })
    }

    function stop(){
        utils.setStatusBar("Bug Analysis Tool", "White");
        utils.bug_report_stop();
    }
};