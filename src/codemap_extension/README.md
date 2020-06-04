# 3D Code Map

Program Analysis tool for bug detection.
It is a vscode extension which can be installed into Vscode 1.43.0 at least.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/demo.gif)

After the program is compiled by analysis, it is used to display the analysis node information.

## Dev Instructions

-   Clone the repository
-   Run `cd codemap_extension`
-   Run `yarn`  
-   Run `yarn go`
-   Run `vsce package`

## User Instructions

Download [vsix file and test zip](https://github.com/SVF-tools/WebSVF/releases/tag/0.0.1)





Trying to click on the button at the bottom left.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/red.png)

After a while time to wait all function load.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/load.png)

It will show the red block when all function stopped.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/blue.png)

And server running will show light blue.

Click the node, it will hightlight on a file which you have open before.

## Publish Instructions

-   Follow the Build Instructions
-   Run `cd codemap_extension`
-   Run `yarn`
-   Run `yarn go`
-   Run `vsce package`

## Webview

Implements the UI and is hosted inside a webview in VS Code.
Can be opened in a browser window.
Uses websockets and JSON RPC to communicate with the extension.

## Extension

Creates the webview in VS Code, data server and a render server.
The render server serves the _WebShow.ts_ that is loaded by the webview.

If click the lower-left button of `3D CODE MAP Web page` will loading and data process will listen get / post information from render server.

The webview is served from an http server rather than the file system to work around some security mechanisms,

## Consideration

All source coding in TS. After yarn compilation, They will become general js code among the ./out. Please modify the code in TS. Otherwise, your replacement information in JS will disappear with the update.
