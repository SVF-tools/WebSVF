import * as vscode from "vscode";
import * as data from "../data";
import * as fs from "fs";
import * as path from "path";

export class WebView extends data.WebPanel {
    constructor(webInfo: data.WebInfo) {
        super(webInfo, data.context)
    }

    protected receiveMessage(message: any) {
        super.receiveMessage(message);
        switch (message.command) {
            case "pos":
                this.ShowFileWithPos(message.file, message.line);
                break;
        }
    }

    protected ShowFileWithPos(file: string, line: number) {
        let rootPath = data.rootPath();
        if (!rootPath) {
            vscode.window.showErrorMessage(`[ RootPath Null Eroor ]`);
            return;
        }
        let filePath = path.join(rootPath, file);
        // It will open explorer
        // vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer");
        if (fs.existsSync(filePath)) {
            let stat = fs.statSync(filePath);
            let range: vscode.Range = new vscode.Range(+line - 1, 0, +line - 1, 0);
            if (stat.isFile()) {
                vscode.window.showTextDocument(vscode.Uri.file(filePath), { selection: range, viewColumn: 2 });
            }
        } else {
            vscode.window.showErrorMessage(`[ Cannot find ${filePath} ]`);
        }
    }
}