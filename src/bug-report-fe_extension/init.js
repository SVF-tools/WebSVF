const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils'); //utils
var constants = require("./constants"); //Constants
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.init', function () {
		let workspace = vscode.workspace.rootPath;
            if (fs.existsSync(workspace + constants.workspace_json)) {
				vscode.window.showInformationMessage("Loading the Bug Analysis Tool!");//Display a message box to the user
				utils.init(constants.download_uri);//Download the zip, unzip it to a folder and then remove the zip.
            }else{
				//Display an error message box to the user when there is no test.json found.
				vscode.window.showErrorMessage('No Bug-Analysis-Report.json found in the workplace, the bug_report plugin cannot be actived!');
			}
        }));
	
		
        //vscode.commands.executeCommand('extension.init');
};