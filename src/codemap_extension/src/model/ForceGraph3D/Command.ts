"use strict";
import * as vscode from "vscode";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { StatusBarForceGraph3DManager } from "./StatusBar";
import {
    ReactPanelForceGraph3DManager,
    ReactPanelForceGraph3D,
} from "./ReactPanel";
import { ReactPanelManager, ForceGraphInfo } from "../../components/ReactPanel";
import * as CommonInterface from "./CommonInterface";

export interface CommandInfo {
    [key: string]: string;
    key: string;
    command: string;
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
        StatusBarForceGraph3DManager.switchTurn();

        this.loadWebPanel();
    }
    private loadWebPanel() {
        if (
            StatusBarForceGraph3DManager.switchBar ===
            CommonInterface.SwitchBar.on
        ) {
            const forceGraphInfo: ForceGraphInfo = ReactPanelManager.createForceGraphInfo(
                this.coreData.PanelConfigPath
            );
            const newReactPanel: ReactPanelForceGraph3D = new ReactPanelForceGraph3D(
                forceGraphInfo.reactInfo,
                forceGraphInfo.webViewInfo
            );
            ReactPanelForceGraph3DManager.createPanel(
                this.coreData.PanelConfigPath,
                newReactPanel
            );
        } else {
            ReactPanelForceGraph3DManager.deletePanel();
        }
    }
}
