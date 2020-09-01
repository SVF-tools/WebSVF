import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { RgisterTreeDataProvider } from "../components/treeview";
import * as svfBarInfo from "../config/SVFBuildBar.json";
import { StoreInfo } from "../storeInfo";

class SVFTreeDataProvider extends RgisterTreeDataProvider {
    constructor() {
        let rootPath = path.join(
            StoreInfo.extensionContext.extensionPath,
            svfBarInfo.OpenConifg.folder
        );
        if (fs.existsSync(rootPath)) {
            
        }
        super("svfbackend", rootPath);
    }
}

export { SVFTreeDataProvider };
