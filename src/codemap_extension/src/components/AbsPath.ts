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

    private static getVscodeResource(relativePath: string) {
        const diskPath = vscode.Uri.file(
            path.join(this.getExtensionPath(), relativePath)
        );
        return diskPath.with({ scheme: "vscode-resource" }).toString();
    }

    private static getAbsolutePath(relativePath: string) {
        return path.join(this.getExtensionPath(), relativePath);
    }

    private static getExtensionPath(): string {
        return ActivateVscodeContext.context.extensionPath;
    }
}
