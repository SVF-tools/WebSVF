"use strict";

import * as vscode from "vscode";
import { ActivateVscodeContext } from "./ActivateVscodeContext";

// It is a format interface for one situation status bar show.
export interface StatusBarInfo {
    [key: string]: string | number | boolean | vscode.ThemeColor;
    command: string;
    text: string;
    color: vscode.ThemeColor;
    show: boolean;
}

// It is a format interface for all situation of the status bar use.
export interface StatusBarInfoUnit {
    [key: string]: number | vscode.StatusBarAlignment | Array<StatusBarInfo>;
    alignment: vscode.StatusBarAlignment;
    priority: number;
    unit: Array<StatusBarInfo>;
}

export enum StatusCode {
    halting = 0,
    loading,
    running,
}

//It is a management class for all Status Bar store and control.
export class ManageStatusBar {
    // Set/Array always need initialize.
    private static _statusBarMemoryUnit: Map<String, StatusBar> = new Map();
    static get statusBarMemoryUnit(): Map<String, StatusBar> {
        return ManageStatusBar._statusBarMemoryUnit;
    }
    public static createStatusBarByJsonFile(jsonFilePath: string): boolean {
        // assembly info
        const statusBarInfoUnit: StatusBarInfoUnit = ManageStatusBar.assemblyInfoFromJsonFile(
            jsonFilePath
        );
        // create status bar
        const key: string = this.recognizeKey(jsonFilePath);
        return ManageStatusBar.createStatusBar(key, statusBarInfoUnit);
    }

    public static recognizeKey(jsonFilePath: string): string {
        const info = require(jsonFilePath);
        return info["name"];
    }

    public static assemblyInfoFromJsonFile(
        jsonFilePath: string
    ): StatusBarInfoUnit {
        // require json config file
        const info = require(jsonFilePath);
        let alignment: vscode.StatusBarAlignment;
        if (new String(info["alignment"]).toLowerCase() === "left") {
            alignment = vscode.StatusBarAlignment.Left;
        } else {
            alignment = vscode.StatusBarAlignment.Right;
        }

        // set status bar info array
        let unit: Array<StatusBarInfo> = new Array();
        info["unit"].forEach((element: any) => {
            let color = new vscode.ThemeColor(element["color"]);
            let statusBarInfo: StatusBarInfo = {
                command: element["command"],
                text: element["text"],
                color: color,
                show: element["show"],
            };
            unit.push(statusBarInfo);
        });

        // set status bar info unit
        let statusBarInfoUnit: StatusBarInfoUnit = {
            alignment: alignment,
            priority: info["priority"],
            unit: unit,
        };
        return statusBarInfoUnit;
    }
    public static createStatusBar(
        key: string,
        statusBarInfoUnit: StatusBarInfoUnit
    ): boolean {
        if (!this._statusBarMemoryUnit.has(key)) {
            const newStatusBar = new StatusBar(statusBarInfoUnit);
            this._statusBarMemoryUnit.set(key, newStatusBar);
            return true;
        } else {
            vscode.window.showErrorMessage(
                `StatusBarMemoryUnit already has the key: ${key}`
            );
            return false;
        }
    }
    public static deleteStatusBar(statusBarName: string): boolean {
        if (this._statusBarMemoryUnit.has(statusBarName)) {
            this._statusBarMemoryUnit.delete(statusBarName);
            return true;
        }
        return false;
    }
    public static findStatusBar(key: string): StatusBar | undefined {
        return this._statusBarMemoryUnit.get(key);
    }
}

//It is the core status bar class for every function it can be used.
export class StatusBar {
    // when the status bar push into the array of vscode.subscriptions, it will return a array number.
    // _pushNumber will store the array number for management.
    private _pushNumber: number | null = null;
    public get pushNumber(): number | null {
        return this._pushNumber;
    }
    public set pushNumber(value: number | null) {
        this._pushNumber = value;
    }

    // _statusbar is the core of the class, and need relative info to build.
    private _statusbar: vscode.StatusBarItem | null = null;

    // All _statusbar needs info are here.
    private _statusBarInfoUnit: StatusBarInfoUnit | null = null;
    public get statusBarInfoUnit(): StatusBarInfoUnit | null {
        return this._statusBarInfoUnit;
    }
    public set statusBarInfoUnit(value: StatusBarInfoUnit | null) {
        this._statusBarInfoUnit = value;
    }

    //When the class instantiation, it will build a a new status bar.
    constructor(statusBarInfoUnit: StatusBarInfoUnit) {
        if (
            statusBarInfoUnit !== null &&
            statusBarInfoUnit.unit !== null &&
            statusBarInfoUnit.unit[0] !== null
        ) {
            this.statusBarInfoUnit = statusBarInfoUnit;
            this._statusbar = vscode.window.createStatusBarItem(
                statusBarInfoUnit["alignment"],
                statusBarInfoUnit["priority"]
            );
            if (!this.setStatusBar(statusBarInfoUnit.unit[0])) {
                vscode.window.showErrorMessage(
                    "Cannot set status bar when initial."
                );
            }
            this.pushStatusBar(ActivateVscodeContext.context);
        } else {
            vscode.window.showErrorMessage(
                "Cannot recognize status bar info unit."
            );
        }
    }

    //To set the situation of status bar.
    public setStatusBar(loadInfo: StatusBarInfo): boolean {
        // (statusBarInfo[0].alignment, statusBarInfo[0].priority) also good way
        if (this._statusbar !== null) {
            this._statusbar.command = loadInfo["command"];
            this._statusbar.text = loadInfo["text"];
            this._statusbar.color = loadInfo["color"];
            if (loadInfo["show"]) {
                this._statusbar.show();
            } else {
                this._statusbar.hide();
            }
            return true;
        }
        return false;
    }

    //Push the Status Bar into vscode extension context
    public pushStatusBar(context: vscode.ExtensionContext): boolean {
        if (this._statusbar !== null && this._pushNumber !== null) {
            this._pushNumber = context.subscriptions.push(this._statusbar);
            return true;
        }
        return false;
    }
}
