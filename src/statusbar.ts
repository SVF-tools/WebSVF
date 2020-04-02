'use strict';

import { StatusBarItem, StatusBarAlignment, window, ThemeColor } from 'vscode';
import { GenericDataStructure } from './genericDataStructure';
import { Push } from './push';

export class Statusbar extends Push {

	private static _statusbar: StatusBarItem;
	private static _create_flag: number = 0;
	public static get statusbar(): StatusBarItem {
		return Statusbar._statusbar;
	}

	public push(): StatusBarItem {
		return Statusbar.statusbar;
	}

	constructor(public info: GenericDataStructure) {
		super();
		if (Statusbar._create_flag === 0) {
			Statusbar._statusbar = window.createStatusBarItem(StatusBarAlignment.Left, 100);
			Statusbar._statusbar.command = info.codemap_extension_command;
			Statusbar._statusbar.text = `${info.codemap_extension_start_tag} ${info.codemap_extension_display}`;
			Statusbar.statusbar.color = new ThemeColor("errorForeground");
			Statusbar._statusbar.show();
			Statusbar._create_flag++;
		}
	}
}