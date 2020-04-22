const vscode = require('vscode');
var path = require("path");

const constants = {
    //Path
    workspace: vscode.workspace.rootPath,
    node_app: '.bug-report', //Node app folder
    node_branch: path.sep + 'WebSVF-WebSVF-frontend-server', //Node app branch name
    workspace_json: path.sep + 'Bug-Analysis-Report.json', //To test if the Bug-Analysis-Report.json exists in the workspace.
    config_abspath: path.sep + 'config' + path.sep +'bug-analysis-JSON_absolute-dir.config', //The absolute path of config file in the workspace.
    node_json: path.sep + this.node_app + this.node_branch + this.workspace_json,
    download_uri: 'https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/WebSVF-WebSVF-frontend-server.zip' //Download the bug_report analysis tool as a zip from remote github
}

module.exports = constants;