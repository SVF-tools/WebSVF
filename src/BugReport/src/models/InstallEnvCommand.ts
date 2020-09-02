import * as vscode from "vscode";
import { StoreInfo, CheckEnv } from "../storeInfo";
import * as installEnv from "../config/Install_ENV.json";
import * as svfBarInfo from "../config/SVFBuildBar.json";
import { BasicCommand } from "../components/command";
import { Terminal } from "../components/terminal";
import * as path from "path";
import * as fs from "fs";

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
        let basic_env_cmd_check = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.BASIC
        );
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
        let whole_env_path = path.join(
            StoreInfo.extensionContext.extensionPath,
            installEnv.WHOLE_ENV
        );
        if (fs.existsSync(whole_env_path)) {
            fs.unlinkSync(whole_env_path);
        }
        fs.appendFileSync(whole_env_path, `bash ${basic_env_cmd_check}` + "\n");
        fs.appendFileSync(
            whole_env_path,
            `source ${basic_env_cmd} ${StoreInfo.extensionContext.extensionPath}` +
                "\n"
        );
        fs.appendFileSync(
            whole_env_path,
            `bash ${graph_env_cmd} ${scripts_folder}` + "\n"
        );
        fs.appendFileSync(
            whole_env_path,
            `bash ${download_backend} ${folderPath}` + "\n"
        );
        fs.appendFileSync(
            whole_env_path,
            `bash ${svf_script_path} ${svf_backend_path}` + "\n"
        );

        InstallEnvCommand.terminal.cmd(`source ${whole_env_path}`);
    }
}
export { InstallEnvCommand };
