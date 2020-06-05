"use strict";

import * as vscode from "vscode";

export class ActivateVscodeContext {
    private static _activeEditor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor;
    public static get activeEditor(): vscode.TextEditor | undefined {
        return ActivateVscodeContext._activeEditor;
    }
    public static set activeEditor(value: vscode.TextEditor | undefined) {
        ActivateVscodeContext._activeEditor = value;
    }
    private static _context: vscode.ExtensionContext;
    private static _have_not_store_yet: boolean = true;
    public static get have_not_store_yet(): boolean {
        return ActivateVscodeContext._have_not_store_yet;
    }
    public static get context(): vscode.ExtensionContext {
        return ActivateVscodeContext._context;
    }
    public static set context(value: vscode.ExtensionContext) {
        // The '_context' cannot rewrite once been written
        if (ActivateVscodeContext._have_not_store_yet) {
            ActivateVscodeContext._context = value;
            ActivateVscodeContext._have_not_store_yet = false;
        }
    }
}

export function StoreVscodeContext(context: vscode.ExtensionContext): boolean {
    const store_success_or_not: boolean =
        ActivateVscodeContext.have_not_store_yet;
    ActivateVscodeContext.context = context;
    let settings = vscode.workspace.getConfiguration("codeMap");
    settings.update("ShowOrHide", "hide").then();
    settings.update("GraphMode", "NotSelect").then();

    return store_success_or_not;
}

export function AbsolutePath(filePath: string): string {
    return ActivateVscodeContext.context.asAbsolutePath(filePath);
}
