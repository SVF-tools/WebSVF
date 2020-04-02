'use strict';
import { ExtensionContext, Uri } from 'vscode';
import path = require("path");

export class AbsPath {
    public static vspath(context: ExtensionContext, relativePath: string) {
        return AbsPath.getExtensionFileVscodeResource(context, relativePath);
    }

    public static abspath(context: ExtensionContext, relativePath: string) {
        return AbsPath.getExtensionFileAbsolutePath(context, relativePath);
    }

    private static getExtensionFileVscodeResource(context: ExtensionContext, relativePath: string) {
        const diskPath = Uri.file(path.join(context.extensionPath, relativePath));
        return diskPath.with({ scheme: 'vscode-resource' }).toString();
    }

    private static getExtensionFileAbsolutePath(context: ExtensionContext, relativePath: string) {
        return path.join(context.extensionPath, relativePath);
    }
}