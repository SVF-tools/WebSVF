"use strict";
import * as path from "path";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { VscodeUriInfo } from "../../components/ReactPanel";
import * as vscode from "vscode";

export interface ConfigPath {
    [key: string]: string;
    barConfigPath: string;
    PanelConfigPath: string;
    CommandConfigPath: string;
}

export interface PositionInfo {
    [key: string]: number | vscode.Uri | string;
    filePathUri: vscode.Uri;
    lineNumber: number;
    startPosition: number;
    endPosition: number;
    themeName: string;
    flag: string;
}

export enum SwitchBar {
    on,
    off,
}

export enum BarSituation {
    waiting,
    going,
}

export interface CommandInfo {
    [key: string]: string;
    key: string;
    command: string;
}

export enum statusHighLight {
    show,
    hide,
}

export class RegisterCommand {
    constructor(protected coreData: ConfigPath, protected command: string) {
        this.pushCommand(this.registerCommand());
    }

    protected getCommandInfo(): CommandInfo {
        const info = require(this.coreData.CommandConfigPath);
        const commandInfo: CommandInfo = {
            key: info["name_" + this.command],
            command: info["command_" + this.command],
        };
        return commandInfo;
    }

    protected getCommand(): string {
        const commandInfo: CommandInfo = this.getCommandInfo();
        return commandInfo.command;
    }

    protected getKey(): string {
        const commandInfo: CommandInfo = this.getCommandInfo();
        return commandInfo.key;
    }

    protected registerCommand(): vscode.Disposable {
        return vscode.commands.registerCommand(this.getCommand(), () => {
            this.mainFunc();
        });
    }

    protected pushCommand(registerCommand: vscode.Disposable) {
        ActivateVscodeContext.context.subscriptions.push(registerCommand);
    }

    protected mainFunc() {}
}

export function getConfigRootPath(): string {
    return path.join(
        ActivateVscodeContext.context.extensionPath,
        "configuration",
        "ForceGraph3D"
    );
}

export function getConfigPath(filePath: string): string {
    return path.join(getConfigRootPath(), filePath);
}
