"use strict";
import * as path from "path";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { VscodeUriInfo } from "../../components/ReactPanel";
import { Uri } from "vscode";

export interface ConfigPath {
    [key: string]: string;
    barConfigPath: string;
    PanelConfigPath: string;
    CommandConfigPath: string;
}

export interface PositionInfo {
    [key: string]: number | Uri;
    filePathUri: Uri;
    lineNumber: number; 
    startPosition: number;
    endPosition: number;
}

export enum SwitchBar {
    on,
    off,
}

export enum BarSituation {
    waiting,
    going,
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
