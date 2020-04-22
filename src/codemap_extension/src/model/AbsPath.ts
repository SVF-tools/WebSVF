"use strict";
import * as vscode from "vscode";
import * as path from "path";

export class AbsPath {
    public static vsPath(relativePath: string) {
        return AbsPath.getVscodeResource(relativePath);
    }

    public static absPath(relativePath: string) {
        return AbsPath.getAbsolutePath(relativePath);
    }

    public static absUri(relativePath: string) {
        const absPath = this.absPath(relativePath);
        return vscode.Uri.file(absPath);
    }

    private static getVscodeResource(relativePath: string) {
        const diskPath = this.absUri(relativePath);
        return diskPath.with({ scheme: "vscode-resource" }).toString();
    }

    private static getAbsolutePath(relativePath: string) {
        return path.join(this.getFolderPath(), relativePath);
    }

    private static getFolderPath(): string {
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        return "";
    }
}
