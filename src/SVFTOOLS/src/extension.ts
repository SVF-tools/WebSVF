import * as vscode from "vscode";
import * as data from "./data";
import * as cmd from "./model/command";
import * as bar from "./model/statusbar";
import * as tree from "./model/treeview";


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
            instance: new cmd.InstallSVFEnvironment()
        },
        {
            key: data.config.command.OPEN_TARGET,
            instance: new cmd.OpenTargetCommand(
                data.config.command.OPEN_TARGET
            )
        },
        {
            key: data.config.command.OPEN_BACKEND,
            instance: new cmd.OpenBackendCommand()
        },
        {
            key: data.config.command.BUILD_TARGET,
            instance: new cmd.BuildTargetCommand(
                data.config.command.BUILD_TARGET
            )
        },
        {
            key: data.config.command.BUILD_BACKEND,
            instance: new cmd.TerminialCommand(
                data.config.command.BUILD_BACKEND
            )
        },
        {
            key: data.config.command.SHOW_REPORT,
            instance: new cmd.ShowReportCommand()
        },
        {
            key: data.config.command.REBUILD_BACKEND,
            instance: new cmd.ReBuildBackendCommand(
                data.config.command.REBUILD_BACKEND
            )
        },
        {
            key: data.config.command.UPGRADE_EXTENSION,
            instance: new cmd.UpgradeExtensionCommand(
                data.config.command.UPGRADE_EXTENSION
            )
        },
        {
            key: data.config.command.RELOAD_EXTENSION,
            instance: new cmd.ReloadCommand(
                data.config.command.RELOAD_EXTENSION
            )
        }
    ];
    // statusbar generate
    const statusbar = [
        // {
        //     key: data.config.getStatusbarKeyFromCommand(
        //         data.config.command.INSTALL_ENV
        //     ),
        //     instance: new bar.GenerateBar(data.config.command.INSTALL_ENV),
        // },
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
                data.config.command.REBUILD_BACKEND
            ),
            instance: new bar.GenerateBar(data.config.command.REBUILD_BACKEND),
        },
        {
            key: data.config.getStatusbarKeyFromCommand(
                data.config.command.UPGRADE_EXTENSION
            ),
            instance: new bar.GenerateBar(data.config.command.UPGRADE_EXTENSION),
        }
        // {
        //     key: data.config.getStatusbarKeyFromCommand(
        //         data.config.command.SHOW_REPORT
        //     ),
        //     instance: new bar.GenerateBar(data.config.command.SHOW_REPORT),
        // },
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
    new data.RgisterTreeDataProvider(backendInfo.key, backendInfo.folder, "fileExplorer.open.backendFile");

    let svgresultInfo = data.config.getPathInfo(data.config.pathType.SVG_RESULT_PATH);
    new tree.RgisterTreeView(svgresultInfo.key, svgresultInfo.folder, "fileExplorer.open.svgresultFile");
    // console.log(webviewInfo);

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
    let reloadInfo = data.config.getPathInfo(data.config.pathType.RELOAD_FLAG);

    if (targetPathInfo.openFlag && fs.existsSync(targetPathInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.OPEN_TARGET);
    }

    if (backednPathInfo.openFlag && fs.existsSync(backednPathInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.OPEN_BACKEND);
    }

    if (envInfo.openFlag && fs.existsSync(envInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.INSTALL_ENV);
    }

    if (reloadInfo.openFlag && fs.existsSync(reloadInfo.openFlag)) {
        vscode.commands.executeCommand(data.config.command.RELOAD_EXTENSION);
    }
}

export function deactivate() { }