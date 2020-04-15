"use strict";
import * as vscode from "vscode";
import {
    ReactPanelManager,
    ReactPanel,
    ReactInfo,
    WebViewInfo,
} from "../../components/ReactPanel";
import { ConventPage } from "../../components/ConventPage";

export class ReactPanelForceGraph3DManager {
    private static _key: string | undefined = undefined;
    public static get key(): string | undefined {
        return ReactPanelForceGraph3DManager._key;
    }

    public static createPanel(
        filePath: string,
        newReactPanel?: ReactPanel
    ): boolean {
        if (
            this._key === undefined &&
            ReactPanelManager.createReactPanelByJsonFile(
                filePath,
                newReactPanel
            )
        ) {
            ConventPage.ConventHtml("./build/web-part/index.html");
            this._key = ReactPanelManager.recognizeKey(filePath);
            return true;
        }
        return false;
    }

    public static deletePanel(): boolean {
        if (
            this.key !== undefined &&
            ReactPanelManager.deleteReactPanel(this.key)
        ) {
            this._key = undefined;
            return true;
        }
        return false;
    }

    public static getPanel(): ReactPanel | undefined {
        if (this._key !== undefined) {
            return ReactPanelManager.findReactPanel(this._key);
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

export class ReactPanelForceGraph3D extends ReactPanel {
    constructor(reactInfo: ReactInfo, webViewInfo: WebViewInfo) {
        super(reactInfo, webViewInfo);
        this.reactPanel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case "alert":
                        vscode.window.showErrorMessage(message.text);
                        break;
                    case "toSomeWhere":
                        const filePath = message.path;
                        const lineNumber = message.line;
                        const startPosition = message.start;
                        const endPosition = message.end;
                        vscode.window.showInformationMessage(
                            `filePath: ${filePath}\n lineNumber: ${lineNumber}\n startPosition: ${startPosition} \n endPosition: ${endPosition}`
                        );
                        break;
                }
            },
            null,
            this.disposables
        );
    }
}
