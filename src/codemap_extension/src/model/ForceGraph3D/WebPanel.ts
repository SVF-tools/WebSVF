"use strict";
import * as vscode from "vscode";
import {
    WebPanelManager,
    WebPanel,
    WebInfo,
    WebViewInfo,
} from "../../components/WebPanel";

import { LineTagManager, LineTag } from "../../components/LineTag";
import { LineTagForceGraph3DManager } from "./LineTag";

import { StatusBarForceGraph3DManager } from "./StatusBar";
import { RegisterCommandForceGraph3DManager } from "./Command";
import * as CommonInterface from "./CommonInterface";

import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";

export class WebPanelForceGraph3DManager {
    private static _key: string | undefined = undefined;
    public static get key(): string | undefined {
        return WebPanelForceGraph3DManager._key;
    }

    public static createPanel(
        filePath: string,
        newWebPanel?: WebPanel
    ): boolean {
        if (
            this._key === undefined &&
            WebPanelManager.createWebPanelByJsonFile(filePath, newWebPanel)
        ) {
            this._key = WebPanelManager.recognizeKey(filePath);
            return true;
        }
        return false;
    }

    public static deletePanel(): boolean {
        if (
            this.key !== undefined &&
            WebPanelManager.deleteWebPanel(this.key)
        ) {
            this._key = undefined;
            return true;
        }
        return false;
    }

    public static getPanel(): WebPanel | undefined {
        if (this._key !== undefined) {
            return WebPanelManager.findWebPanel(this._key);
        }
        return undefined;
    }

    public static webReady(): boolean {
        const panel: WebPanel | undefined = this.getPanel();
        return panel !== undefined ? panel.webReady() : false;
    }

    public static hasKey(): boolean {
        if (this._key !== undefined) {
            return true;
        }
        return false;
    }
}

export class WebPanelForceGraph3D extends WebPanel {
    constructor(webInfo: WebInfo) {
        super(webInfo);
        this.webPanel.onDidDispose(
            () => {
                if (
                    StatusBarForceGraph3DManager.switchBar ===
                    CommonInterface.SwitchBar.on
                ) {
                    RegisterCommandForceGraph3DManager.rcf?.turnAndLoad();
                    return;
                } else {
                    this.dispose();
                }
            },
            null,
            this.disposables
        );
    }

    protected receiveMessage(message: any) {
        super.receiveMessage(message);
        switch (message.command) {
            case "toSomeWhere":
                const filePath = message.path;
                const lineNumber = message.line;
                const startPosition = message.start;
                const endPosition = message.end;
                const activeEditor = ActivateVscodeContext.activeEditor;
                if (activeEditor) {
                    vscode.window.showTextDocument(activeEditor.document);
                }

                let num = 0;
                const handle: NodeJS.Timeout = setInterval(() => {
                    if (
                        vscode.window.activeTextEditor?.document.uri.fsPath ===
                        ActivateVscodeContext.activeEditor?.document.uri.fsPath
                    ) {
                        this.LoadTag(lineNumber);
                        clearInterval(handle);
                    }
                }, 0);

                return;
        }
    }

    protected LoadTag(lineNumber: number) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor === undefined) {
            vscode.window.showWarningMessage("Try to open an editor first.");
        } else {
            const preKey: string = LineTagManager.assemblyKey(
                activeEditor,
                lineNumber
            );

            if (LineTagManager.findLineTag(preKey) === undefined) {
                const key = LineTagForceGraph3DManager.createLineTag(
                    activeEditor,
                    lineNumber
                );
                if (preKey !== key) {
                    vscode.window.showErrorMessage("preKey !== key.");
                }
                const lineTag: LineTag | undefined =
                    key !== undefined
                        ? LineTagManager.findLineTag(key)
                        : undefined;

                if (lineTag !== undefined) {
                    lineTag.LoadDecoration();
                } else {
                    vscode.window.showErrorMessage("linTag is undefined.");
                }
            } else {
                if (!LineTagManager.deleteLineTag(preKey)) {
                    vscode.window.showErrorMessage("deleteLineTag false.");
                }
            }
        }
    }
}
