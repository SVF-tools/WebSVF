'use strict';

import { ExtensionContext } from 'vscode';
import { ModuleInstallation } from './moduleInstallation';
import { ImportInfo } from "./importInfo";

export function activate(context: ExtensionContext) {
	ImportInfo.vscontext = context;
	const plugin = new ModuleInstallation();

	plugin.funcpush.forEach(element => {
		context.subscriptions.push(element.push());
	});

}

export function deactivate() { }
