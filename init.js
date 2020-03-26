const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.init', function () {
		let destPath = vscode.workspace.rootPath+"/Bug-Analysis-Report.json";//To test if the Bug-Analysis-Report.json exists in the workspace.
            if (fs.existsSync(destPath)) {
				vscode.window.showInformationMessage("Loading the Bug Analysis Tool!");//Display a message box to the user
				let uri = "https://github.com/SVF-tools/WebSVF/archive/bug-report-fe.zip";//Download the bug_report analysis tool as a zip from remote github
				utils.git_clone(uri);//Download the zip, unzip it to a folder and then remove the zip.
            }else{
				//Display an error message box to the user when there is no test.json found.
				vscode.window.showErrorMessage('No Bug-Analysis-Report.json found in the workplace, the bug_report plugin cannot be actived!');
			}
        }));
	
		
        //vscode.commands.executeCommand('extension.init');
    };