import { InitData } from "@coder/protocol";
import { IProductConfiguration } from "vs/platform/product/node/product";

class Product implements IProductConfiguration {
	public nameShort = "code-map";
	public nameLong = "code-map";
	public documentationUrl = "https://code.visualstudio.com/docs";
	public keyboardShortcutsUrlMac = "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf";
	public keyboardShortcutsUrlLinux = "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf";
	public keyboardShortcutsUrlWin = "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf";
	public introductoryVideosUrl = "https://code.visualstudio.com/docs/getstarted/introvideos";
	public tipsAndTricksUrl = "https://code.visualstudio.com/docs/getstarted/tips-and-tricks";
	public twitterUrl = "https://twitter.com/code";
	public licenseUrl = "https://github.com/cdr/code-server/blob/master/LICENSE";
	public aiConfig = process.env.DISABLE_TELEMETRY ? undefined! : {
		// Only needed so vscode can see that content exists for this value.
		// We override the application insights module.
		asimovKey: "content",
	};
	public enableTelemetry = process.env.DISABLE_TELEMETRY ? false : true;

	private _dataFolderName: string | undefined;
	public get dataFolderName(): string {
		if (!this._dataFolderName) {
			throw new Error("trying to access data folder name before it has been set");
		}

		return this._dataFolderName;
	}

	// tslint:disable-next-line:no-any
	public extensionsGallery: any = {
		get serviceUrl(): string {
			return process.env.SERVICE_URL || "https://v1.extapi.coder.com";
		},

		get itemUrl(): string {
			return process.env.ITEM_URL || "";
		},

	};

	public extensionExecutionEnvironments = {
		"wayou.vscode-todo-highlight": "worker",
		"vscodevim.vim": "worker",
		"coenraads.bracket-pair-colorizer": "worker",
	};

	public fetchUrl = "";

	public initialize(_data: InitData): void {
		// Nothing at the moment; dataFolderName isn't used since we override the
		// extension path.
	}
}

export default new Product();
