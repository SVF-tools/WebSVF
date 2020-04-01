const vscode = require('vscode');

const constants = {
    //Path
    workspace: vscode.workspace.rootPath,
    node_app: '.bug-report', //Node app folder
    node_branch: '/WebSVF-bug-report-fe', //Node app branch name
    workspace_json: '/Bug-Analysis-Report.json', //To test if the Bug-Analysis-Report.json exists in the workspace.
    config_abspath: '/config/bug-analysis-JSON_absolute-dir.config', //The absolute path of config file in the workspace.
    node_json: '/'+this.node_app + this.node_branch + this.workspace_json,
    download_uri: 'https://github.com/SVF-tools/WebSVF/archive/bug-report-fe.zip' //Download the bug_report analysis tool as a zip from remote github
}

module.exports = constants;