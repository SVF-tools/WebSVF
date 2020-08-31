import * as vscode from "vscode";
import * as svfBarInfo from "../config/SVFBuildBar.json";
import * as svfInfo from "../config/BugReportSVF.json";
import * as targetInfo from "../config/BugRepoetTarget.json";
import { BasicCommand } from "../components/command";
import { SVFBarType } from "./SVFBuildBar";
import { StoreInfo, ChangeInputFileStatus } from "../storeInfo";
import * as path from "path";
import * as fs from "fs";
import { setTimeout } from "timers";
import { CommandMode, BugReportTerminal } from "./BugReportTerminal";
import { exec, execSync } from "child_process";
import * as folderInfo from "../config/FolderInfo.json";

class SVFBuildCommand extends BasicCommand {
    protected barType: SVFBarType | undefined;
    protected showFlag: boolean | undefined;
    constructor(barType: SVFBarType) {
        let command: string = "";
        switch (barType) {
            case SVFBarType.OpenConifg:
                command = svfBarInfo.OpenConifg.command;
                break;
            case SVFBarType.BuildSvfEx:
                command = svfBarInfo.BuildSvfEx.command;
                break;
            case SVFBarType.BuildTarget:
                command = svfBarInfo.BuildTarget.command;
                break;
            default:
                vscode.window.showErrorMessage("Register Command Error.");
                console.log(`[Register Error] SVF barType: ${barType}`);
                return;
        }
        super(StoreInfo.extensionContext, command);
        this.barType = barType;
        this.showFlag = false;
    }
    protected exeCommand() {
        switch (this.barType) {
            case SVFBarType.OpenConifg:
                this.OpenConfigCommand();
                break;
            case SVFBarType.BuildSvfEx:
                this.BuildSvfExCommand();
                break;
            case SVFBarType.BuildTarget:
                this.BuildTargetCommand();
                break;
            default:
                vscode.window.showErrorMessage("Run Command Error.");
                console.log(`[Run Command Error] SVF barType: ${this.barType}`);
                return;
        }
    }
    protected OpenConfigCommand() {
        let extensionPath = StoreInfo.extensionContext.extensionPath;
        let folder = svfBarInfo.OpenConifg.folder;
        let file = svfBarInfo.OpenConifg.path;

        let folderPath: string = path.join(extensionPath, folder);
        let filePath: string = path.join(folderPath, file);

        if (this.showFlag) {
            if (
                vscode.window.activeTextEditor &&
                vscode.window.activeTextEditor.document.fileName === filePath
            ) {
                this.hideText();
                if (this.checkFolder(StoreInfo.OpenTargetFlag) === 2) {
                    const USER_HOME =
                        process.env.HOME || process.env.USERPROFILE;
                    if (!USER_HOME) {
                        console.log(`Cannot find USER_HOME: ${USER_HOME}`);
                        return -1;
                    }
                    const INPUT_PROJECT = path.join(
                        USER_HOME,
                        folderInfo.FolderPath
                    );
                    const targetPath = path.join(
                        INPUT_PROJECT,
                        svfBarInfo.BuildTarget.path
                    );
                    this.showTarget(targetPath);
                }
            } else {
                this.checkFolder(StoreInfo.OpenBackEndFlag);
                this.showText(filePath);
            }
        } else {
            if (
                vscode.window.activeTextEditor &&
                vscode.window.activeTextEditor.document.fileName === filePath
            ) {
                vscode.window.showInformationMessage("SVF BACKEND OPENED");
            }
            if (!fs.existsSync(filePath)) {
                if (fs.existsSync(folderPath)) {
                    this.DownloadSVFLogic(
                        folderPath,
                        filePath,
                        "The key file is lost. Do you want to delete old folder and download new one?"
                    );
                } else {
                    this.DownloadSVFLogic(
                        folderPath,
                        filePath,
                        "You don't have SVF-example folder. Do you want to download it?"
                    );
                }
            } else {
                this.checkFolder(StoreInfo.OpenBackEndFlag);
                this.showText(filePath);
            }
        }
    }
    public showText(filePath: string) {
        vscode.window.showTextDocument(vscode.Uri.file(filePath));
        this.showFlag = true;
        StoreInfo.svfOpenConfigBar.setText(svfBarInfo.OpenConifg.text2);
    }
    protected hideText() {
        vscode.window.activeTextEditor?.hide();
        this.showFlag = false;
        StoreInfo.svfOpenConfigBar.setText(svfBarInfo.OpenConifg.text);
    }
    public checkFolder(flagFile: string): number {
        const USER_HOME = process.env.HOME || process.env.USERPROFILE;
        if (!USER_HOME) {
            console.log(`Cannot find USER_HOME: ${USER_HOME}`);
            return -1;
        }
        const INPUT_PROJECT = path.join(USER_HOME, "INPUT_PROJECT");
        console.log(INPUT_PROJECT);
        if (!fs.existsSync(INPUT_PROJECT)) {
            fs.mkdirSync(INPUT_PROJECT);
        }
        vscode.commands.getCommands().then(function (result) {
            console.log(result);
        });
        const input_project_uri = vscode.Uri.file(INPUT_PROJECT);
        if (vscode.workspace.rootPath !== INPUT_PROJECT) {
            ChangeInputFileStatus(true, flagFile);
            vscode.commands.executeCommand(
                "vscode.openFolder",
                input_project_uri
            );
            return 1; // open folder
        }
        return 2; // in right folder
    }
    public showTarget(filePath: string) {
        console.log("showTarget");
        if (fs.existsSync(filePath)) {
            vscode.window.showTextDocument(vscode.Uri.file(filePath));
        } else {
            let promise = vscode.window.showInformationMessage(
                "You don't have example.c file to compile, do you want to create an example ?",
                "YES",
                "NO"
            );
            let selfThis = this;
            promise.then(function (result) {
                switch (result) {
                    case "YES":
                        let targetFile: string = svfBarInfo.BuildTarget.path;
                        let examplePath = path.join(
                            StoreInfo.extensionContext.extensionPath,
                            "example",
                            targetFile
                        );
                        console.log(`cp ${examplePath} ${filePath}`);
                        execSync(`cp ${examplePath} ${filePath}`);
                        vscode.window.showTextDocument(
                            vscode.Uri.file(filePath)
                        );
                        break;
                    case "NO":
                        return;
                    default:
                        return;
                }
            });
        }
    }
    protected BuildSvfExCommand() {
        if (!StoreInfo.bugReportTerminal) {
            StoreInfo.bugReportTerminal = new BugReportTerminal(
                svfInfo.name,
                CommandMode.SVF
            );
        } else if (StoreInfo.bugReportTerminal.name !== svfInfo.name) {
            StoreInfo.bugReportTerminal.RemoveTerminal();
            StoreInfo.bugReportTerminal = new BugReportTerminal(
                svfInfo.name,
                CommandMode.SVF
            );
        }
        StoreInfo.bugReportTerminal.RunCommand();
    }
    protected BuildTargetCommand() {
        if (!StoreInfo.targetTerminal) {
            StoreInfo.targetTerminal = new BugReportTerminal(
                targetInfo.name,
                CommandMode.TARGET
            );
        } else if (StoreInfo.targetTerminal.name !== targetInfo.name) {
            StoreInfo.targetTerminal.RemoveTerminal();
            StoreInfo.targetTerminal = new BugReportTerminal(
                targetInfo.name,
                CommandMode.TARGET
            );
        }
        StoreInfo.targetTerminal.RunCommand();
    }
    public DownloadSVFLogic(
        folderPath: string,
        filePath: string,
        info: string
    ) {
        let promise = vscode.window.showInformationMessage(info, "YES", "NO");
        let selfThis = this;
        promise.then(function (result) {
            switch (result) {
                case "YES":
                    selfThis.DownloadSVF(folderPath, filePath);
                    break;
                case "NO":
                    return;
                default:
                    // vscode.window.showErrorMessage("No Way to be here.");
                    return;
            }
        });
    }
    private DownloadSVF(folderPath: string, filePath: string) {
        let terminal = vscode.window.createTerminal("DOWNLOAD SVF-EX");
        let extensionPath = StoreInfo.extensionContext.extensionPath;
        let bashfile = `./scripts/download.sh ${folderPath}`;
        let bashPath: string = path.join(extensionPath, bashfile);
        let cli: string = `bash ${bashPath}`;
        terminal.show();
        terminal.sendText(cli);
        let handel = setInterval(() => {
            if (fs.existsSync(filePath)) {
                this.showText(filePath);
                clearInterval(handel);
                setTimeout(() => {
                    terminal.dispose();
                }, 2000);
            }
        }, 100);
    }

    private DownloadLLVM(filePath: string) {
        let terminal = vscode.window.createTerminal("CONFIG LLVM");
        let extensionPath = StoreInfo.extensionContext.extensionPath;
        let bashfile = "./scripts/llvm.sh";
        let bashPath: string = path.join(extensionPath, bashfile);
        let cli: string = `source ${bashPath}`;
        terminal.show();
        terminal.sendText(cli);
        let handel = setInterval(() => {
            if (fs.existsSync(filePath)) {
                clearInterval(handel);
                setTimeout(() => {
                    terminal.dispose();
                }, 2000);
            }
        }, 100);
    }
}

export { SVFBuildCommand };
