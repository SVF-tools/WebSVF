import * as vscode from "vscode";
import { StoreInfo, CheckEnv } from "../storeInfo";
import * as installEnv from "../config/Install_ENV.json";
import * as svfBarInfo from "../config/SVFBuildBar.json";
import { BasicCommand } from "../components/command";
import { Terminal } from "../components/terminal";
import * as path from "path";

class InstallEnvCommand extends BasicCommand {
    protected static terminal: Terminal;
    constructor() {
        super(StoreInfo.extensionContext, installEnv.command);
    }
    protected exeCommand() {
        let rootPath = vscode.workspace.rootPath;
        let extensionPath = StoreInfo.extensionContext.extensionPath;
        let folder = svfBarInfo.OpenConifg.folder;
        let file = svfBarInfo.OpenConifg.path;

        let folderPath: string = path.join(extensionPath, folder);
        let filePath: string = path.join(folderPath, file);

        if (!InstallEnvCommand.terminal) {
            InstallEnvCommand.terminal = new Terminal(installEnv.title);
        } else {
            InstallEnvCommand.terminal.CreateTerminal(installEnv.title);
        }
        InstallEnvCommand.terminal.show();
        let basic_env_cmd = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.BASE_ENV
        );
        let graph_env_cmd = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.GRAPH_ENV
        );
        let scripts_folder = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.SCRIPTS_PATH
        );
        let download_backend = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.BACKEND_DOWNLOAD
        );
        let svf_script_path: string = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.SVF_EX
        );
        let svf_backend_path = path.join(
            StoreInfo.extensionContext.extensionPath,
            svfBarInfo.OpenConifg.folder
        );
        InstallEnvCommand.terminal.cmd(
            `source ${basic_env_cmd} ${StoreInfo.extensionContext.extensionPath}`
        );
        InstallEnvCommand.terminal.cmd(
            `bash ${graph_env_cmd} ${scripts_folder}`
        );
        InstallEnvCommand.terminal.cmd(
            `bash ${download_backend} ${folderPath}`
        );
        InstallEnvCommand.terminal.cmd(
            `bash ${svf_script_path} ${svf_backend_path}`
        );
    }
}
export { InstallEnvCommand };
