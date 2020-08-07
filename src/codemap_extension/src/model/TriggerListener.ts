"use strict";

import * as vscode from "vscode";
import { ActivateVscodeContext } from "../components/ActivateVscodeContext";
import { LineTagManager } from "../components/LineTag";

export function configListener() {
    let context = ActivateVscodeContext.context;
    vscode.workspace.onDidChangeConfiguration(
        function () {
            let showOrHide = ActivateVscodeContext.show_mode;
            // vscode.window.showInformationMessage(`ShowOrHide: ${showOrHide}`);
            if (vscode.window.activeTextEditor) {
                switch (showOrHide) {
                    case "show":
                        LineTagManager.LoadDecoration();
                        break;
                    case "hide":
                        LineTagManager.UnLoadDecoration();
                        break;
                }
            }
        },
        null,
        context.subscriptions
    );

    vscode.window.onDidChangeActiveTextEditor(
        function (editor) {
            let showOrHide = ActivateVscodeContext.show_mode;
            if (editor) {
                let fsPath = editor.document.uri.fsPath;
                ActivateVscodeContext.activeEditor = editor;
                // vscode.window.showInformationMessage(`fsPath: ${fsPath}`);
                switch (showOrHide) {
                    case "show":
                        LineTagManager.LoadDecoration();
                        break;
                    case "hide":
                        LineTagManager.UnLoadDecoration();
                        break;
                }
            }
        },
        null,
        context.subscriptions
    );
}
