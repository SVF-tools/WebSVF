const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports = function(context) {
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.bugreport', function () {
        let folder = "/WebSVF-bug-report-fe/";
        let file_path = vscode.workspace.rootPath+folder+"Bug-Analysis-Report.json";//  workspace/bug-report-fe/WebSVF-bug-report-fe/Bug-Analysis-Report.json
        console.log(file_path);
        if(fs.existsSync(file_path)){
            return new Promise(function (resolve, reject) {                
                utils.bug_report();//Send command via terminal to start the node app.
                resolve();
            }).then(function () {
                setTimeout(function () {
                    utils.open_internal_browser("http://localhost:3000/");//Open a internal webview in the right side.
                  }, 5000);
            })
        }else{
            vscode.window.showErrorMessage("Missing the necessary files, please run 'Report init' to load the 'Bug Analysis Tool'");
        }
    }));
    //vscode.commands.executeCommand('extension.bugreport');
};