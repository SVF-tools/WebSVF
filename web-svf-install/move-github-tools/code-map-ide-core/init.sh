#!bash
yarn
NODE_ENV=production VERSION=local-dev yarn task build:server:binary


rm ./lib/vscode/src/vs/workbench/contrib/welcome/page/browser/vs_code_welcome_page_bak.ts
cp vs_code_welcome_page_bak.ts ./lib/vscode/src/vs/workbench/contrib/welcome/page/browser/vs_code_welcome_page_bak.ts

bash build.sh
