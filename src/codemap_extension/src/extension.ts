"use strict";

import * as vscode from "vscode";
import { StoreVscodeContext } from "./components/ActivateVscodeContext";
import { LoadMajorModule } from "./model/LoadMajorModule";

export function activate(context: vscode.ExtensionContext) {
    StoreVscodeContext(context); // Store Vscode Context
    LoadMajorModule(); // Load Major Module
}

export function deactivate() {}
