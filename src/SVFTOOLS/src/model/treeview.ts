import * as vscode from "vscode";
import * as data from "../data";
import * as fs from "fs";
import * as path from "path";
import * as web from "./webview";


export class NewTreeView extends data.NewTreeDataProvider {
    constructor(protected rootPath: string, protected cmd: string) {
        super(rootPath, cmd);
    }
    protected openResource(resource: vscode.Uri): void {
        // vscode.window.showTextDocument(resource);
        // vscode.window.showInformationMessage(path.extname(resource.fsPath));
        if (path.extname(resource.fsPath) === ".svf") {
            let webviewInfo: data.WebInfo = data.config.getWeibviewInfo(data.config.command.SHOW_CODEMAP);
            webviewInfo.svgRelativePath = resource.fsPath;
            webviewInfo.title = path.basename(resource.fsPath, ".svf");
            new web.WebView(webviewInfo);
        }
    }
}

export class RgisterTreeView {

    constructor(id: string, rootPath: string, command: string) {
        this.registerTree(id, rootPath, command);
    }

    registerTree(id: string, rootPath: string, command: string) {

        let provider = new NewTreeView(rootPath, command);

        vscode.window.createTreeView(id, { treeDataProvider: provider });

        setInterval(() => {
            provider.refresh();
        }, 1000);

    }
}