# 3D Code Map

Program Analysis tool for bug detection.
It is a vscode extension which can be installed into Vscode 1.41.0 at least.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/demo.gif)

After the program is compiled by analysis, it is used to display the analysis node information.

## Build Instructions

-   Clone the repository
-   Run `cd codemap_extension`
-   Run `yarn`  
-   Run `yarn create_all`

## Dev Instructions

This project uses yarn workspaces and consists of the sub-projects _data-process_, _extension_ and _render-web-panel_.
To setup a dev environment, follow these steps:

-   Clone the repository
-   Run `cd codemap_extension`
-   Run `yarn`
-   Run `yarn go` initially

For the _render-webpanel_ project code,
Find `./web-part` And All `./src/webpanel.ts` folder.

In fact, it uses the express server to virtualize a front-end rendering thread.

You can use VS Code to launch and debug the extension.

Trying to click on the button at the bottom left.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/red.png)

After a while time to wait all function load.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/load.png)

It will show the red block when all function stopped.

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/blue.png)

And server running will show light blue.

Because of the exceptional features of the webpage in vscode, We use server style to avoid the problem of vscode's restrictions on static webpage resources.

When the button in the lower-left corner turns blue, a thread will run inside the IDE extension process. The rendered front-end page port 6886 nominally

Otherwise, the extension will start a webserver on its own, hosting the `web` folder of the _render_ project.

## Publish Instructions

-   Follow the Build Instructions
-   `cd codemap_extension`
-   `vsce package`

## Architecture

![](https://github.com/SVF-tools/WebSVF/blob/master/src/codemap_extension/images/codemap_flowchart.png)

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
