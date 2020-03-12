const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.init', function () {
		let destPath = vscode.workspace.rootPath+"/test.json";//To test if the test.json exists in the workspace.
            if (fs.existsSync(destPath)) {
				vscode.window.showInformationMessage('bug_report plugin is now active!');//Display a message box to the user
				let uri = "https://github.com/SVF-tools/WebSVF.git";//Clone the bug_report analysis tool from remote github
				utils.git_clone(uri);//git clone the uri via terminal.
            }else{
				//Display an error message box to the user when there is no test.json found.
				vscode.window.showErrorMessage('No test.json found in the workplace, the bug_report plugin cannot be actived!');
			}
        }));

        //vscode.commands.executeCommand('extension.init');
    };