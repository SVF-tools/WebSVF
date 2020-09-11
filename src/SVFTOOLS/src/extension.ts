import * as vscode from "vscode";
import * as data from "./data";
import * as cmd from "./model/command";
import * as bar from "./model/statusbar";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    initial(context);
}

function initial(context: vscode.ExtensionContext) {
    // data initial
    data.initial(context);
    // command generate.
    const command = [
        {
            key: data.config.command.INSTALL_ENV,
            instance: new cmd.InstallSVFEnvironment(),
        },
        {
            key: data.config.command.OPEN_TARGET,
            instance: new cmd.OpenTargetCommand(),
        },
        {
            key: data.config.command.OPEN_BACKEND,
            instance: new cmd.OpenBackendCommand(),
        },
        {
            key: data.config.command.BUILD_TARGET,
            instance: new cmd.TerminialCommand(
                data.config.command.BUILD_TARGET
            ),
        },
        {
            key: data.config.command.BUILD_BACKEND,
            instance: new cmd.TerminialCommand(
                data.config.command.BUILD_BACKEND
            ),
        },
        {
            key: data.config.command.SHOW_REPORT,
            instance: new cmd.ShowReportCommand(),
        },
    ];
    // statusbar generate
    const statusbar = [
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.INSTALL_ENV
            ),
            instance: new bar.GenerateBar(data.config.command.INSTALL_ENV),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_BACKEND
            ),
            instance: new bar.GenerateBar(data.config.command.BUILD_BACKEND),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.BUILD_TARGET
            ),
            instance: new bar.GenerateBar(data.config.command.BUILD_TARGET),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_TARGET
            ),
            instance: new bar.GenerateBar(data.config.command.OPEN_TARGET),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.OPEN_BACKEND
            ),
            instance: new bar.GenerateBar(data.config.command.OPEN_BACKEND),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.SHOW_REPORT
            ),
            instance: new bar.GenerateBar(data.config.command.SHOW_REPORT),
        },
    ];

    // command register in manager
    command.forEach((element) => {
        data.mcommand.generate(element.key, element.instance);
    });
    // statusbar register in manager
    statusbar.forEach((element) => {
        data.mbar.generate(element.key, element.instance);
    });

    let backendInfo = data.config.getPathInfo(data.config.pathType.BACKEND_PATH);
    new data.RgisterTreeDataProvider(backendInfo.key, backendInfo.folder);

    /*some times, extension will open a target folder. it will load all extension again.
    so extension will forget what it should do before. the flag will remind extension what it should do.*/
    checkFlag();

    /*This is for developer get all vscode current commands in extension path commands.log.
    it should not use for finial edition*/
    // data.getCommands();
}

function checkFlag() {

    let targetPathInfo = data.config.getPathInfo(data.config.pathType.TARGET_PATH);
    let backednPathInfo = data.config.getPathInfo(data.config.pathType.BACKEND_PATH);
    let envInfo = data.config.getPathInfo(data.config.pathType.ENVIRONMENT_SCRIPT_PATH);

    if (targetPathInfo.openFlag && fs.existsSync(targetPathInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.OPEN_TARGET);
    }

    if (backednPathInfo.openFlag && fs.existsSync(backednPathInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.OPEN_BACKEND);
    }

    if (envInfo.openFlag && fs.existsSync(envInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.INSTALL_ENV);
    }
}

export function deactivate() { }