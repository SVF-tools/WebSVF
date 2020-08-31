import * as vsocde from "vscode";
import * as path from "path";
import { StoreInfo } from "../storeInfo";
import { Terminal } from "../components/terminal";
import * as genInfo from "../config/GenerateBugReport.json";

class GenerateBugReport {
    constructor(filePath: string) {
        this.GenerateReport(filePath);
    }

    protected GenerateReport(filePath: string) {
        let terminal = new Terminal(genInfo.name);
        let command = `${genInfo.compile_c} ${filePath}`;
        terminal.cmd(command);

        let fileType = path.extname(filePath);
        switch (fileType) {
            case ".bc":
                command = `${genInfo.compile_bc} ${filePath}`;
                break;
            case ".c":
                vsocde.window.showInformationMessage(
                    "You need click [BUILD INPUT PROJECT] to generate necessary file.",
                    "I GOT IT"
                );
                command = `${genInfo.compile_c} ${filePath}`;
                return;
            default:
                vsocde.window.showErrorMessage(
                    `[File Type]: ${fileType} could not use to generate bug report.`,
                    "OK"
                );
                return;
        }
    }
}
