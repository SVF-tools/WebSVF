"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { StatusBarForceGraph3DManager } from "./StatusBar";
import { WebPanelForceGraph3DManager, WebPanelForceGraph3D } from "./WebPanel";
import { WebPanelManager, WebViewInfo } from "../../components/WebPanel";
import * as CommonInterface from "./CommonInterface";

import { LineTagManager, LineTag } from "../../components/LineTag";
import { LineTagForceGraph3DManager } from "./LineTag";

export interface CommandInfo {
    [key: string]: string;
    key: string;
    command: string;
}

export enum statusHighLight {
    show,
    hide,
}

export class RegisterCommandForceGraph3DManager {
    private static _rcf: RegisterCommandForceGraph3D | undefined = undefined;
    public static get rcf(): RegisterCommandForceGraph3D | undefined {
        return RegisterCommandForceGraph3DManager._rcf;
    }
    public static initial(coreData: CommonInterface.ConfigPath): boolean {
        if (this._rcf === undefined) {
            this._rcf = new RegisterCommandForceGraph3D(coreData);
            return true;
        }
        return false;
    }
}

export class RegisterCommandForceGraph3D {
    constructor(private coreData: CommonInterface.ConfigPath) {
        this.pushCommand(this.registerCommand());
    }

    private getCommandInfo(): CommandInfo {
        const info = require(this.coreData.CommandConfigPath);
        const commandInfo: CommandInfo = {
            key: info["name"],
            command: info["command"],
        };
        return commandInfo;
    }

    public getCommand(): string {
        const commandInfo: CommandInfo = this.getCommandInfo();
        return commandInfo.command;
    }

    public getKey(): string {
        const commandInfo: CommandInfo = this.getCommandInfo();
        return commandInfo.key;
    }

    private registerCommand(): vscode.Disposable {
        return vscode.commands.registerCommand(this.getCommand(), () => {
            this.mainFunc();
        });
    }

    private pushCommand(registerCommand: vscode.Disposable) {
        ActivateVscodeContext.context.subscriptions.push(registerCommand);
    }

    private mainFunc() {
        // vscode.window.showInformationMessage("3D FORCE GRAPH");
        if (StatusBarForceGraph3DManager.switchTurn()) {
            ActivateVscodeContext.activeEditor = vscode.window.activeTextEditor;
            this.loadWebPanel();
        }
    }
    public turnAndLoad() {
        StatusBarForceGraph3DManager.barSituation =
            CommonInterface.BarSituation.going;
        this.mainFunc();
    }
    private loadWebPanel() {
        if (
            StatusBarForceGraph3DManager.switchBar ===
            CommonInterface.SwitchBar.on
        ) {
            const webViewInfo: WebViewInfo = WebPanelManager.generateWebViewInfo(
                this.coreData.PanelConfigPath
            );
            const newWebPanel: WebPanelForceGraph3D = new WebPanelForceGraph3D(
                webViewInfo.webInfo
            );
            WebPanelForceGraph3DManager.createPanel(
                this.coreData.PanelConfigPath,
                newWebPanel
            );
            this.changeConfigForHightLine(statusHighLight.show);
        } else {
            WebPanelForceGraph3DManager.deletePanel();
            this.changeConfigForHightLine(statusHighLight.hide);
        }
    }

    private changeConfigForHightLine(status: statusHighLight) {
        let settings = vscode.workspace.getConfiguration("codeMap");
        let Flag = 0;
        switch (status) {
            case statusHighLight.show:
                Flag = 1;
                settings.update("ShowOrHide", "show").then(showInfo);
                break;
            case statusHighLight.hide:
                Flag = 2;
                settings.update("ShowOrHide", "hide").then(showInfo);
                break;
            default:
                Flag = 3;
                settings.update("ShowOrHide", "hide").then(showInfo);
                break;
        }

        function showInfo() {
            // vscode.window.showInformationMessage(`Flag: ${Flag}`);
        }
    }
}
