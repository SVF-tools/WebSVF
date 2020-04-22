"use strict";
import * as vscode from "vscode";
import * as path from "path";
import { ActivateVscodeContext } from "./ActivateVscodeContext";

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
        return path.join(this.getExtensionPath(), relativePath);
    }

    private static getExtensionPath(): string {
        return ActivateVscodeContext.context.extensionPath;
    }
}
