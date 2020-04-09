"use strict";
import * as vscode from "vscode";
import { ReactPanelManager, ReactPanel } from "../../components/ReactPanel";
import { ConventPage } from "../../components/ConventPage";

export class ReactPanelForceGraph3DManager {
    private static _key: string | undefined = undefined;
    public static get key(): string | undefined {
        return ReactPanelForceGraph3DManager._key;
    }

    public static createPanel(filePath: string): boolean {
        if (
            this._key === undefined &&
            ReactPanelManager.createReactPanelByJsonFile(filePath)
        ) {
            ConventPage.ConventHtml("./build/react-part/index.html");
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
