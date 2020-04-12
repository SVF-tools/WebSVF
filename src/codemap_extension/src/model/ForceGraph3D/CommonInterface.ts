"use strict";
import * as path from "path";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";

export interface ConfigPath {
    [key: string]: string;
    barConfigPath: string;
    PanelConfigPath: string;
    CommandConfigPath: string;
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
