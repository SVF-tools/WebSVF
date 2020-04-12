"use strict";
import * as path from "path";
import * as vscode from "vscode";
import { ActivateVscodeContext } from "../../components/ActivateVscodeContext";
import { StatusBarForceGraph3DManager } from "./StatusBar";
import { RegisterCommandForceGraph3DManager } from "./Command";
import * as CommonInterface from "./CommonInterface";

function getConfigPath(): CommonInterface.ConfigPath {
    // Load configure info from Json file
    const rootPath: string = CommonInterface.getConfigRootPath();
    const BarConfigPath = path.join(rootPath, "BarConfig.json");
    const ReactPanelConfigPath = path.join(rootPath, "ReactPanelConfig.json");
    const CommandConfigPath = path.join(rootPath, "CommandConfig.json");
    const WebPanelConfigPath = path.join(rootPath, "WebPanelConfig.json");

    const configPath: CommonInterface.ConfigPath = {
        barConfigPath: BarConfigPath,
        PanelConfigPath: WebPanelConfigPath,
        CommandConfigPath: CommandConfigPath,
    };
    return configPath;
}

export function LoadModule_ForceGraph3D() {
    const configPath: CommonInterface.ConfigPath = getConfigPath();
    RegisterCommand_ForceGraph3D(configPath); // register command
    CreateStatusBar_ForceGraph3D(configPath); // create status bar
}

// Register ForceGraph3D Command
function RegisterCommand_ForceGraph3D(configPath: CommonInterface.ConfigPath) {
    if (!RegisterCommandForceGraph3DManager.initial(configPath)) {
        vscode.window.showErrorMessage(
            "Register Command ForceGraph3DManager initial false."
        );
    }
}
// Create ForceGraph3D Status Bar
function CreateStatusBar_ForceGraph3D(configPath: CommonInterface.ConfigPath) {
    if (!StatusBarForceGraph3DManager.initial(configPath)) {
        vscode.window.showErrorMessage(
            "StatusBar ForceGraph3D Manager initial false."
        );
    }
}
