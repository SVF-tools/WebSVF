import * as vscode from "vscode";
import { StartActive } from "./storeInfo";

export function activate(context: vscode.ExtensionContext) {
    StartActive(context);
}

export function deactivate() {}
