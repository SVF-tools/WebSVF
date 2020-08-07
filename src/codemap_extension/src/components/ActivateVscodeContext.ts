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
    private static _show_status: string;
    public static get show_mode(): string {
        return ActivateVscodeContext._show_status;
    }
    public static set show_mode(value: string) {
        ActivateVscodeContext._show_status = value;
    }
    private static _graph_mode: string;
    public static get graph_mode(): string {
        return ActivateVscodeContext._graph_mode;
    }
    public static set graph_mode(value: string) {
        ActivateVscodeContext._graph_mode = value;
    }
}

export function StoreVscodeContext(context: vscode.ExtensionContext): boolean {
    const store_success_or_not: boolean =
        ActivateVscodeContext.have_not_store_yet;
    ActivateVscodeContext.context = context;
    // let settings = vscode.workspace.getConfiguration("codeMap");
    // settings.update("ShowOrHide", "hide").then();
    // settings.update("GraphMode", "NotSelect").then();
    ActivateVscodeContext.show_mode = "hide";
    ActivateVscodeContext.graph_mode = "NotSelect";

    return store_success_or_not;
}

export function AbsolutePath(filePath: string): string {
    return ActivateVscodeContext.context.asAbsolutePath(filePath);
}
