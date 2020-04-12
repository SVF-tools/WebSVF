"use strict";
import * as vscode from "vscode";
import {
    WebPanelManager,
    WebPanel,
    WebInfo,
    WebViewInfo,
} from "../../components/WebPanel";

import { StatusBarForceGraph3DManager } from "./StatusBar";
import { RegisterCommandForceGraph3DManager } from "./Command";
import * as CommonInterface from "./CommonInterface";

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
        this.webPanel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case "alert":
                        vscode.window.showErrorMessage(message.text);
                        return;
                    case "toSomeWhere":
                        const filePath = message.path;
                        const lineNumber = message.line;
                        const startPosition = message.start;
                        const endPosition = message.end;
                        vscode.window.showInformationMessage(
                            `filePath: ${filePath}\n lineNumber: ${lineNumber}\n startPosition: ${startPosition} \n endPosition: ${endPosition}`
                        );
                        return;
                    case "connect":
                        this.webPanel.webview.postMessage({
                            status: "connected",
                        });
                        return;
                }
            },
            null,
            this.disposables
        );

        this.webPanel.onDidDispose(
            () => {
                if(StatusBarForceGraph3DManager.switchBar === CommonInterface.SwitchBar.on){
                    RegisterCommandForceGraph3DManager.rcf?.turnAndLoad();
                    return;
                }else{
                    this.dispose();
                }
            },
            null,
            this.disposables
        );
    }
}
