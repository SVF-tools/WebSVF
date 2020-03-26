'use strict';

import { ExtensionContext } from 'vscode';
import { ModuleInstallation } from './ModuleInstallation';

export function activate(context: ExtensionContext) {

	const plugin = new ModuleInstallation(context);

	plugin.funcpush.forEach(element => {
		context.subscriptions.push(element.push());
	});

}

export function deactivate() { }
