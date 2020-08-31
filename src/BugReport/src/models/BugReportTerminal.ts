import * as vscode from "vscode";
import * as svfInfo from "../config/BugReportSVF.json";
import * as barInfo from "../config/SVFBuildBar.json";
import * as targetInfo from "../config/BugRepoetTarget.json";
import { StoreInfo } from "../storeInfo";
import { Terminal } from "../components/terminal";
import * as path from "path";
import * as fs from "fs";

enum CommandMode {
    SVF,
    TARGET,
}

class BugReportTerminal extends Terminal {
    public get name(): string {
        return this._name;
    }
    protected envSvfPath: string = path.join(
        StoreInfo.extensionContext.extensionPath,
        svfInfo.env
    );
    protected envTargetPath: string = path.join(
        StoreInfo.extensionContext.extensionPath,
        targetInfo.env
    );
    protected envSvfCli: string = `source ${this.envSvfPath} ${StoreInfo.extensionContext.extensionPath}`;
    protected envTargetCli: string = `source ${this.envTargetPath}`;
    protected svfScriptPath: string = path.join(
        StoreInfo.extensionContext.extensionPath,
        svfInfo["svf-ex"]
    );
    protected targetScriptPath: string = path.join(
        StoreInfo.extensionContext.extensionPath,
        targetInfo.compile
    );
    protected svfBackendPath = path.join(
        StoreInfo.extensionContext.extensionPath,
        barInfo.OpenConifg.folder
    );
    protected svfCli: string = `bash ${this.svfScriptPath} ${this.svfBackendPath}`;
    protected targetCli: string = `bash ${this.targetScriptPath} ${barInfo.BuildTarget.path}`;
    protected pwdCli: string = `cd ${vscode.workspace.rootPath}`;
    constructor(private _name: string, protected mode: CommandMode) {
        super(_name);
    }

    public RunCommand() {
        if (!fs.existsSync(svfInfo.llvm_path)) {
            let handle = vscode.window.showInformationMessage(
                "Cannot recognize basic environment, do you want to config it first ?",
                "YES",
                "NO"
            );
            let selfThis = this;
            handle.then(function (result) {
                switch (result) {
                    case "YES":
                        selfThis.RunCommandBasic();
                        break;
                    case "NO":
                        vscode.window.showInformationMessage(
                            "Well, You could config by yourself or click the build button again."
                        );
                        return;
                }
            });
        } else {
            this.RunCommandBasic();
        }
    }

    public RunCommandBasic() {
        if (!this.CheckStatus()) {
            this.CreateTerminal(this.name);
        }
        this.terminal.show();

        switch (this.mode) {
            case CommandMode.SVF:
                this.terminal.sendText(this.envSvfCli);
                this.terminal.sendText(this.svfCli);
                break;
            case CommandMode.TARGET:
                this.terminal.sendText(this.envTargetCli);
                this.terminal.sendText(this.targetCli);
                break;
            default:
                break;
        }
    }
}

export { CommandMode, BugReportTerminal };
