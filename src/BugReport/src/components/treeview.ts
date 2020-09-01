import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

class NewTreeItem extends vscode.TreeItem {
    constructor(
        label: string,
        private _itemPath: string,
        state?: vscode.TreeItemCollapsibleState,
        private _itemCommand?: vscode.Command
    ) {
        super(label, state);
    }
    get itemPath(): string {
        return this._itemPath;
    }
    resourceUri = vscode.Uri.file(this.itemPath);
    command = this._itemCommand;
}

class NewTreeDataProvider implements vscode.TreeDataProvider<NewTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<
        NewTreeItem | undefined | void
    > = new vscode.EventEmitter<NewTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<
        NewTreeItem | undefined | void
    > = this._onDidChangeTreeData.event;

    constructor(private rootPath: string) {
        vscode.commands.registerCommand("fileExplorer.openFile", (resource) =>
            this.openResource(resource)
        );
    }
    private openResource(resource: vscode.Uri): void {
        vscode.window.showTextDocument(resource);
    }
    getTreeItem(element: NewTreeItem): vscode.TreeItem {
        return element;
    }
    getChildren(element?: NewTreeItem): Thenable<NewTreeItem[]> {
        if (!this.rootPath || !fs.existsSync(this.rootPath)) {
            console.log(`NewTreeDataProvider root is ${this.rootPath}`);
            return Promise.resolve([]);
        }
        if (!element) {
            return Promise.resolve(this.getItem(this.rootPath));
        } else {
            return Promise.resolve(this.getItem(element.itemPath));
        }
    }
    isDir(path: string) {
        let stat = fs.statSync(path);
        if (stat.isDirectory()) {
            return true;
        }
        return false;
    }
    getItem(rootPath: string): NewTreeItem[] {
        if (!this.isDir(rootPath)) {
            return [];
        }
        let dir = fs.readdirSync(rootPath);
        let dirTreeItem: NewTreeItem[] = [];
        dir.forEach((itemElement) => {
            const itemPath: string = path.join(rootPath, itemElement);
            const collapsible: vscode.TreeItemCollapsibleState = this.isDir(
                itemPath
            )
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None;
            if (this.isDir(itemPath)) {
                dirTreeItem.push(
                    new NewTreeItem(itemElement, itemPath, collapsible)
                );
            } else {
                let command = {
                    command: "fileExplorer.openFile",
                    title: "Open File",
                    arguments: [vscode.Uri.file(itemPath)],
                };
                dirTreeItem.push(
                    new NewTreeItem(itemElement, itemPath, collapsible, command)
                );
            }
        });
        return dirTreeItem;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

class RgisterTreeDataProvider {
    constructor(id: string, rootPath: string) {
        this.registerTree(id, rootPath);
    }

    registerTree(id: string, rootPath: string) {
        let provider = new NewTreeDataProvider(rootPath);
        vscode.window.createTreeView(id, {
            treeDataProvider: provider,
        });
        vscode.commands.registerCommand("svfbackend.refreshEntry", () =>
            provider.refresh()
        );
        setInterval(() => {
            provider.refresh();
        }, 1000);
    }
}

export { NewTreeItem, NewTreeDataProvider, RgisterTreeDataProvider };
