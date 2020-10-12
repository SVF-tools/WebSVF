import * as vscode from "vscode";
import { Config } from "./configs/config";
import { CommandBasic, mcommand } from "./components/command";
import { BarBasic, mbar } from "./components/statusbar";
import { mterminal } from "./components/terminial";
import { RgisterTreeDataProvider } from "./components/treeview";
import { WebInfo, WebPanel } from "./components/webview";
import * as fs from "fs";
import * as path from "path";

export let context: vscode.ExtensionContext;
export let config: Config;

// extension postion
export const extensionPath = function () {
    return context.extensionPath;
};

// vscode workspace path
export const rootPath = function () {
    return vscode.workspace.rootPath;
};

// system home path
export const userHome = function () {
    return process.env.HOME || process.env.USERPROFILE;
};

// initial when extension active
export function initial(value: vscode.ExtensionContext) {
    context = value; // import context for all part use
    config = new Config(); // json config will analysis
}

// basic command components. CommandBasic is a command Class. mcommand is a command Manager.
export { CommandBasic, mcommand };

//basic bar components. BarBasic is a bar Class. mabr is a bar Manager.
export { BarBasic, mbar };

//mterminal is a terminal Manager. it is very import for terminal manage.
export { mterminal };

export { RgisterTreeDataProvider };

export { WebInfo, WebPanel };

export function getCommands() {
    vscode.commands.getCommands().then((result) => {
        let commands: string = "";
        result.forEach((info) => {
            commands += info + "\n";
        });
        fs.writeFileSync(`${path.join(extensionPath(), "command.log")}`, commands);
    });
}