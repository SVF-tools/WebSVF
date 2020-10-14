import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface CommandElement {
    key: string;
    commandElement: CommandBasic;
}

class CommandBasic {

    constructor(private context: vscode.ExtensionContext, protected cmd: string, protected exeFunc?: Function) {
        this.registerCommand();
    }

    protected registerCommand() {
        let disposable: vscode.Disposable = vscode.commands.registerCommand(this.cmd,
            () => {
                this.exeFunc ? this.exeFunc() : this.Func();
            }
        );
        this.context.subscriptions.push(disposable);
    }

    protected Func() { }

    ShowFolderOnWorkspace(folderPath: string) {

        if (fs.existsSync(folderPath)) {

            let stat = fs.statSync(folderPath);

            if (stat.isDirectory()) {
                let uri = vscode.Uri.file(folderPath);
                vscode.commands.executeCommand("vscode.openFolder", uri);
            }

        }
    }

    ShowFileInTextDoc(filePath: string) {

        vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer");

        if (fs.existsSync(filePath)) {

            let stat = fs.statSync(filePath);

            if (stat.isFile()) {
                vscode.window.showTextDocument(vscode.Uri.file(filePath));
            }
        }
    }

    ShowFileWithPos(filePath: string, line: number) {

        vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer");

        if (fs.existsSync(filePath)) {

            let stat = fs.statSync(filePath);

            let range: vscode.Range = new vscode.Range(line, 0, line, 0);

            if (stat.isFile()) {
                vscode.window.showTextDocument(vscode.Uri.file(filePath), { selection: range, viewColumn: 2 });
            }
        }

    }

    CreateFolder(folderPath: string) {

        if (!fs.existsSync(folderPath)) {

            let upFolderPath = path.resolve(folderPath, "..");

            if (!fs.existsSync(upFolderPath)) {
                this.CreateFolder(upFolderPath);
            } else {
                fs.mkdirSync(folderPath);
            }
        }
    }

    CreateFile(filePath: string) {

        if (!fs.existsSync(filePath)) {
            let folderPath = path.resolve(filePath, "..");
            this.CreateFolder(folderPath);
        }

        fs.writeFileSync(filePath, "");
    }

    Copy(from: string, to: string) {

        if (fs.existsSync(from)) {

            let upFolder = path.resolve(to, "..");
            this.CreateFolder(upFolder);

            execSync(`cp -rf ${from} ${to}`);

        } else {
            console.log(`[ERROR]: CopyFile form: ${from} is not exist`);
        }

    }

    Delete(thePath: string) {

        if (fs.existsSync(thePath)) {
            execSync(`rm -rf ${thePath}`);
        }

    }
}

class CommandArray {

    private list = new Array<CommandElement>();

    public create(context: vscode.ExtensionContext, key: string, cmd: string, exeFunc: Function) {

        if (this.find(key)) {
            return undefined;
        }

        let commandElement = new CommandBasic(context, cmd, exeFunc);
        let item = { key: key, commandElement: commandElement };

        this.list.push(item);

        return commandElement;
    }

    public generate(key: string, instance: CommandBasic) {

        if (this.find(key)) { return -1; }

        let item = { key: key, commandElement: instance };
        this.list.push(item);

        return this.list.length;
    }

    public find(key: string) {

        let flag = undefined;

        this.list.some((element) => {
            if (element.key === key) {
                flag = element.commandElement;
                return true;
            }
        });
        return flag;
    }

    public exist(key: string): boolean {

        let flag = false;

        this.list.some((element) => {
            if (element.key === key) {
                flag = true;
                return true;
            }
        });
        return flag;
    }
}


const mcommand = new CommandArray();

export { CommandBasic, mcommand };