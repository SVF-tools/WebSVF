"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function activate(context) {
    console.log('Congratulations, your extension "code-map-extension" is now active!');
    let disposable_ConFile = vscode.commands.registerCommand('extension.ConFile', () => {
        SetVscodeFolder();
        let rootPath = vscode.workspace.rootPath;
        if (rootPath) {
            // const vscodefile = path.join(rootPath, ".vscode");
            // const contralFileInProject: string = path.join(vscodefile, "contralmarks.json");
            // const myDate = new Date();
            // let mytime = myDate.toLocaleString();
            // const active = '/home/spc/WORKSPACE/WebCodeMap/README.md';
            // const line = '98';
            // const character = '3';
            // const contral_info = `{"fsPath": "${active}", "line": "${line}", "character": "${character}", "time": "${mytime}"}`;
            // // const test_info = '';
            // fs.writeFileSync(contralFileInProject, contral_info);
            // if (open_setconfil) {
            // 	openFile(contralFileInProject, open_setconfil);
            // 	open_setconfil = false;
            // }
            // const file_info = fs.readFileSync(contralFileInProject).toString();
            // if (file_info !== '') {
            // 	let contralmarks = JSON.parse(file_info);
            // 	let postion = new vscode.Position(parseInt(contralmarks.line, 10), parseInt(contralmarks.character, 10));
            // 	console.log(postion);
            // 	// const fs_read = o(1); const file_info = fs_read.readFileSync(se).toString(); if (file_info !== '') { let contralmarks = JSON.parse(file_info); let postion = new i.Position(parseInt(contralmarks.line, 10), parseInt(contralmarks.character, 10)); i.window.showInformationMessage(`fsPath: ${postion.fsPath.toString()}`); i.window.showInformationMessage(`LINE: ${postion.line.toString()}`); i.window.showInformationMessage(`character: ${postion.character.toString()}`); fs_read.writeFileSync(se, ''); } else { i.window.showInformationMessage(`file_info === ''`) }; 
            // }
            // else {
            // 	console.log(`file_info === ''`);
            // }
        }
        else {
            vscode.window.showErrorMessage("vscode.workspace.rootPath = null");
            return;
        }
    });
    let disposable_CodeMap = vscode.commands.registerCommand('extension.CodeMap', () => {
        vscode.window.showInformationMessage('Code Map!');
        SetVscodeFolder();
        let rootPath = vscode.workspace.rootPath;
        let folderPath = null;
        if (rootPath !== undefined) {
            folderPath = rootPath;
        }
        let editor = vscode.window.activeTextEditor;
        let filePath = null;
        if (editor) {
            filePath = editor.document.fileName;
        }
        console.log(`[Folder]：${folderPath} \n[File]: ${filePath}`);
        let options = {
            prompt: "Label: ",
            placeHolder: "[Select Folder or File Default: Folder]",
        };
        let answer = '';
        if (filePath !== null && folderPath !== null) {
            vscode.window.showInputBox(options).then(value => {
                console.log(value);
                let path = null;
                if (!value) {
                    answer = 'FOLDER';
                }
                else {
                    answer = value.toUpperCase();
                }
                if (answer === "FOLDER" || answer === "FILE") {
                    if (answer === "FOLDER") {
                        path = folderPath;
                    }
                    else {
                        path = filePath;
                    }
                    // vscode.window.showInformationMessage(`You select ${answer}`);
                    console.log(`You select ${answer}`);
                }
                else {
                    vscode.window.showErrorMessage('Please select Folder or File!');
                    console.log(`Please select Folder or File!`);
                    return;
                }
                let info = `{"mode": "${answer}", "path": "${path}"}`;
                fs.writeFileSync(`${__dirname}/info.json`, info);
                openCodeMapTerminal(answer);
                SetVscodeFolder();
            });
        }
        else {
            let path = null;
            if (filePath !== null) {
                answer = 'FILE';
                path = filePath;
            }
            else {
                answer = 'FOLDER';
                path = folderPath;
            }
            let info = `{"mode": "${answer}", "path": "${path}"}`;
            fs.writeFileSync(`${__dirname}/info.json`, info);
            openCodeMapTerminal(answer);
            SetVscodeFolder();
        }
    });
    let disposable_InnerWEB = vscode.commands.registerCommand('extension.InnerWEB', () => {
        // vscode.window.showInformationMessage('Inner WEB!');
        showInnerWeb();
    });
    vscode.workspace.onDidOpenTextDocument(doc => {
    });
    context.subscriptions.push(disposable_CodeMap);
    context.subscriptions.push(disposable_ConFile);
    context.subscriptions.push(disposable_InnerWEB);
}
exports.activate = activate;
function showInnerWeb() {
    const panel = vscode.window.createWebviewPanel('testWebview', // viewType
    "Code Map", vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    panel.webview.html = getWebviewContent();
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
// function to show webview content
function getWebviewContent() {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<style type="text/css">
		html, 
		body {
			height: 100%;
		}
		</style>
	</head>
	<body>
	
        <iframe src="https://localhost:6886/" scrolling="no" width="100%" height="100%" frameBorder="0" ></iframe>
    </body>
    </html>`;
}
let NEXT_TERM_ID = 1;
function openCodeMapTerminal(answer) {
    if ("FOLDER" === answer) {
        const terminal = vscode.window.createTerminal(`[Code Map (${NEXT_TERM_ID++}) ]`);
        terminal.show();
        // terminal.sendText("ls -al");
        terminal.sendText("export LLVM_COMPILER=clang");
        // terminal.sendText("CC=wllvm CXX=wllvm++");
        if (readCompileFile()) {
            exeCompileFile(terminal);
        }
        else {
            if (readCompileFileSelfDefine()) {
                exeCompileFileSelfDefine(terminal);
            }
            else {
                return;
            }
        }
    }
}
function openFile(filePath, openfile) {
    try {
        //打开文本
        vscode.workspace.openTextDocument(filePath).then(document => {
            //显示文本
            if (openfile) {
                vscode.window.showTextDocument(document, { preview: false });
            }
            // if (vscode.window.activeTextEditor) {
            // 	vscode.window.activeTextEditor.hide();
            // }
        }, error => {
            return vscode.window.showErrorMessage("FlashOpen: " + error.message);
        });
    }
    catch (error) {
        return vscode.window.showErrorMessage(error.message);
    }
}
function SetVscodeFolder() {
    let vsrootPath = vscode.workspace.rootPath;
    let editor = vscode.window.activeTextEditor;
    let filePath = null;
    if (editor) {
        filePath = editor.document.fileName;
    }
    if (vsrootPath) {
        const vscodefile = path.join(vsrootPath, ".vscode");
        const resultFileInProject = path.join(vscodefile, "result");
        const contralFileInProject = path.join(vscodefile, "contralmarks.json");
        const jumpFileInProject = path.join(vscodefile, "jumpmarks.json");
        const contralShowInnerFlag = path.join(vscodefile, "contralShowInnerFlag.json");
        if (!fs.existsSync(vscodefile)) {
            fs.mkdirSync(vscodefile);
        }
        if (!fs.existsSync(resultFileInProject)) {
            fs.mkdirSync(resultFileInProject);
        }
        if (!fs.existsSync(contralFileInProject)) {
            const test_info = '';
            fs.writeFileSync(contralFileInProject, test_info);
        }
        if (!fs.existsSync(jumpFileInProject)) {
            const test_info = '';
            fs.writeFileSync(jumpFileInProject, test_info);
        }
        if (!fs.existsSync(contralShowInnerFlag)) {
            const test_info = {
                show: false
            };
            fs.writeFileSync(contralShowInnerFlag, JSON.stringify(test_info));
        }
        openFile(contralFileInProject, true);
        openFile(jumpFileInProject, true);
        if (filePath) {
            openFile(filePath, true);
        }
    }
}
function readCompileFileSelfDefine() {
    let vsrootPath = vscode.workspace.rootPath;
    if (vsrootPath) {
        const slefCompileFile = path.join(vsrootPath, "codemap_compile.txt");
        if (fs.existsSync(slefCompileFile) && fs.statSync(slefCompileFile).isFile()) {
            return true;
        }
        else {
            const info = "[TARGET PATH]\n\n[COMPILE COMMAND]\n\n";
            fs.writeFileSync(slefCompileFile, info);
            openFile(slefCompileFile, true);
            vscode.window.showInformationMessage("Please custom compilation target and command use codemap_compile.txt");
            return false;
        }
    }
    else {
        vscode.window.showErrorMessage("readCompileFileSelfDefine !vsrootPath");
        return false;
    }
}
function exeCompileFileSelfDefine(terminal) {
    return __awaiter(this, void 0, void 0, function* () {
        let vsrootPath = vscode.workspace.rootPath;
        if (vsrootPath) {
            const slefCompileFile = path.join(vsrootPath, "codemap_compile.txt");
            const vscodefile = path.join(vsrootPath, ".vscode");
            if (fs.existsSync(slefCompileFile) && fs.statSync(slefCompileFile).isFile()) {
                const compileInfo = fs.readFileSync(slefCompileFile).toString();
                const compileInfoArray = compileInfo.split('\n');
                const targePath = compileInfoArray[1];
                for (let i = 3; i < compileInfoArray.length; i++) {
                    terminal.sendText(compileInfoArray[i]);
                }
                const result_path = path.join(vsrootPath, targePath);
                const Dot2Json = path.join(__dirname, "../Dot2Json.py");
                const SetEdgeForce = path.join(__dirname, "../SetEdgeForce.js");
                const dir_position = path.join(__dirname, "../out/info.json");
                const resultInProject = path.join(vscodefile, "result");
                const resultFileInProject = path.join(resultInProject, "compile_result");
                const Dot2JsonFileInProject = path.join(resultInProject, "Dot2Json.py");
                const SetEdgeForceFileInProject = path.join(resultInProject, "SetEdgeForce.js");
                const contralShowInnerFlag = path.join(vscodefile, "contralShowInnerFlag.json");
                console.log(`cp ${result_path} ${resultFileInProject}`);
                terminal.sendText(`cp ${result_path} ${resultFileInProject}`);
                if (!fs.existsSync(Dot2JsonFileInProject)) {
                    terminal.sendText(`cp ${Dot2Json} ${Dot2JsonFileInProject}`);
                }
                if (!fs.existsSync(SetEdgeForceFileInProject)) {
                    terminal.sendText(`cp ${SetEdgeForce} ${SetEdgeForceFileInProject}`);
                }
                let bc_command = "extract-bc " + resultFileInProject;
                if (targePath.match(/.*\.a/g)) {
                    bc_command = "extract-bc -b " + resultFileInProject;
                }
                console.log("bc_command: " + bc_command);
                terminal.sendText(`cd ${resultInProject}`);
                console.log(`cd ${resultInProject}`);
                terminal.sendText(bc_command);
                console.log(bc_command);
                terminal.sendText("wpa -ander -svfg -dump-svfg compile_result.bc");
                terminal.sendText("python Dot2Json.py FS_SVFG.dot FS_SVFG.json");
                terminal.sendText("python Dot2Json.py SVFG_before_opt.dot SVFG_before_opt.json");
                terminal.sendText("node SetEdgeForce.js");
                terminal.sendText("cp SVFG_before_opt.json ~/WORKSPACE/d3-react/src/data/SVFG_before_opt.json");
                terminal.sendText("cp SVFG_before_opt.json ~/WORKSPACE/d3-react-server/src/data/post.json");
                terminal.sendText(`cp ${dir_position} ~/WORKSPACE/d3-react-server/src/data/dir_position.json`);
                terminal.sendText(`cd ~/WORKSPACE/d3-react-server/`);
                terminal.sendText(`node test.js`);
                terminal.sendText(`cd ${resultInProject}`);
                terminal.sendText(`mv ${contralShowInnerFlag} ${contralShowInnerFlag}.bak`);
                while (true) {
                    if (!fs.existsSync(contralShowInnerFlag)) {
                        // vscode.window.showInformationMessage("contralShowInnerFlag");
                        showInnerWeb();
                        terminal.sendText(`mv ${contralShowInnerFlag}.bak ${contralShowInnerFlag}`);
                        terminal.hide();
                        break;
                    }
                    yield sleep(1000);
                }
            }
        }
        else {
            vscode.window.showErrorMessage("exeCompileFileSelfDefine !vsrootPath");
        }
    });
}
function exeCompileFile(terminal) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("exeCompileFile");
        let vsrootPath = vscode.workspace.rootPath;
        if (vsrootPath) {
            const vscodefile = path.join(vsrootPath, ".vscode");
            const configure_file = path.join(vscodefile, "coufigure.txt");
            const compileFile = path.join(vscodefile, "compile.json");
            const compile_info = fs.readFileSync(compileFile).toString();
            const compile_info_json = JSON.parse(compile_info);
            const compile_command_begin = `${compile_info_json.mode} BEGIN`;
            const compile_command_end = `${compile_info_json.mode} END`;
            const coufigure_info = fs.readFileSync(configure_file).toString();
            const coufigureArray = coufigure_info.split('\n');
            let begin_number = 0;
            let end_number = 0;
            console.log("compile_command_begin: " + compile_command_begin);
            console.log("compile_command_end: " + compile_command_end);
            for (let i = 0; i < coufigureArray.length; i++) {
                console.log("coufigureArray: " + coufigureArray[i]);
                console.log("coufigureArray match: " + coufigureArray[i].match(compile_command_begin));
                if (null !== coufigureArray[i].match(compile_command_begin)) {
                    console.log("here");
                    begin_number = i;
                    // break;
                }
            }
            for (let i = 0; i < coufigureArray.length; i++) {
                console.log("coufigureArray: " + coufigureArray[i]);
                console.log("coufigureArray match: " + coufigureArray[i].match(compile_command_end));
                if (null !== coufigureArray[i].match(compile_command_end)) {
                    console.log(coufigureArray[i].match(compile_command_end));
                    end_number = i;
                    // break;
                }
            }
            console.log("begin_number:" + begin_number);
            console.log("end_number:" + end_number);
            if (begin_number < end_number) {
                for (let j = begin_number + 1; j < end_number; j++) {
                    terminal.sendText(coufigureArray[j]);
                }
                // next step consider .a condition
                const result_path = path.join(vsrootPath, compile_info_json.target_path);
                const Dot2Json = path.join(__dirname, "../Dot2Json.py");
                const dir_position = path.join(__dirname, "../out/info.json");
                const resultInProject = path.join(vscodefile, "result");
                const resultFileInProject = path.join(resultInProject, "compile_result");
                const Dot2JsonFileInProject = path.join(resultInProject, "Dot2Json.py");
                const contralShowInnerFlag = path.join(vscodefile, "contralShowInnerFlag.json");
                console.log(`cp ${result_path} ${resultFileInProject}`);
                terminal.sendText(`cp ${result_path} ${resultFileInProject}`);
                if (!fs.existsSync(Dot2JsonFileInProject)) {
                    terminal.sendText(`cp ${Dot2Json} ${Dot2JsonFileInProject}`);
                }
                let bc_command = "extract-bc " + resultFileInProject;
                console.log("bc_command: " + bc_command);
                terminal.sendText(`cd ${resultInProject}`);
                console.log(`cd ${resultInProject}`);
                terminal.sendText(bc_command);
                console.log(bc_command);
                terminal.sendText("wpa -ander -svfg -dump-svfg compile_result.bc");
                terminal.sendText("python Dot2Json.py FS_SVFG.dot FS_SVFG.json");
                terminal.sendText("python Dot2Json.py SVFG_before_opt.dot SVFG_before_opt.json");
                terminal.sendText("cp SVFG_before_opt.json ~/WORKSPACE/d3-react/src/data/SVFG_before_opt.json");
                terminal.sendText("cp SVFG_before_opt.json ~/WORKSPACE/d3-react-server/src/data/post.json");
                terminal.sendText(`cp ${dir_position} ~/WORKSPACE/d3-react-server/src/data/dir_position.json`);
                terminal.sendText(`mv ${contralShowInnerFlag} ${contralShowInnerFlag}.bak`);
                while (true) {
                    if (!fs.existsSync(contralShowInnerFlag)) {
                        // vscode.window.showInformationMessage("contralShowInnerFlag");
                        showInnerWeb();
                        terminal.sendText(`mv ${contralShowInnerFlag}.bak ${contralShowInnerFlag}`);
                        terminal.hide();
                        break;
                    }
                    yield sleep(1000);
                }
            }
            else {
                vscode.window.showErrorMessage("exeCompileFile coufigure_info info error");
            }
        }
        else {
            vscode.window.showErrorMessage("exeCompileFile !vsrootPath");
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function readCompileFile() {
    let vsrootPath = vscode.workspace.rootPath;
    // let editor = vscode.window.activeTextEditor;
    // let filePath: string | null = null;
    // if (editor) {
    // 	filePath = editor.document.fileName;
    // }
    console.log("[readCompileFile]");
    if (vsrootPath) {
        const vscodefile = path.join(vsrootPath, ".vscode");
        const slefCompileFile = path.join(vsrootPath, "codemap_compile.txt");
        const compileFile = path.join(vscodefile, "compile.json");
        const configureFile = path.join(vsrootPath, "configure");
        const makefileAm = path.join(vsrootPath, "Makefile.am");
        const cMakeLists = path.join(vsrootPath, "CMakeLists.txt");
        console.log("vscodefile :" + vscodefile);
        console.log("slefCompileFile :" + slefCompileFile);
        console.log("compileFile :" + compileFile);
        console.log("configureFile :" + configureFile);
        console.log("makefileAm :" + makefileAm);
        console.log("cMakeLists :" + cMakeLists);
        if (!fs.existsSync(vscodefile)) {
            console.log("[!vscodefile]");
            fs.mkdirSync(vscodefile);
        }
        if (!fs.existsSync(slefCompileFile)) {
            console.log("[!slefCompileFile]");
            let compile_mode = [0, 0];
            if (fs.existsSync(cMakeLists) && fs.statSync(cMakeLists).isFile()) {
                compile_mode[0] = 1;
            }
            if (fs.existsSync(configureFile) && fs.existsSync(makefileAm) && fs.statSync(configureFile).isFile() && fs.statSync(makefileAm).isFile()) {
                compile_mode[1] = 1;
            }
            console.log(compile_mode);
            console.log("[!slefCompileFile 1]");
            if (1 === compile_mode[0]) {
                console.log("[!slefCompileFile 2]");
                let cmakeSting = fs.readFileSync(cMakeLists).toString();
                let cmakeArray = cmakeSting.split('\n');
                let existCmakeTarget = false;
                for (let i = 0; i < cmakeArray.length; i++) {
                    console.log("[!slefCompileFile 2 + ]" + i);
                    if (null !== cmakeArray[i].match("add_executable")) {
                        console.log("[!slefCompileFile 2 + ]" + i + "match add_executable");
                        existCmakeTarget = true;
                        let cmake_split_1 = cmakeArray[i].split('(');
                        let cmake_split_2 = cmake_split_1[1].split(" ");
                        let config_result = '';
                        for (let j = 0; j < cmake_split_2.length; j++) {
                            if ("" !== cmake_split_2[j]) {
                                config_result = cmake_split_2[j];
                                break;
                            }
                        }
                        buildCompileJsonFile("CMAKE", config_result, compileFile);
                        break;
                    }
                }
                if (!existCmakeTarget) {
                    vscode.window.showErrorMessage("Cannot check CMAKE file target.");
                    return false;
                }
            }
            else if (1 === compile_mode[1]) {
                console.log("[!slefCompileFile 3]");
                // design counfigure makefile.am
                let cmakeSting = fs.readFileSync(makefileAm).toString();
                let cmakeArray = cmakeSting.split('\n');
                let existCounfigureTarget = false;
                for (let i = 0; i < cmakeArray.length; i++) {
                    console.log("[!slefCompileFile 3 + ]" + i);
                    if (null !== cmakeArray[i].match("bin_PROGRAMS")) {
                        console.log("[!slefCompileFile 3 + ]" + i + " match bin_PROGRAMS");
                        existCounfigureTarget = true;
                        let config_split_1 = cmakeArray[i].split('=');
                        console.log(config_split_1);
                        let config_split_2 = config_split_1[1].split(' ');
                        console.log(config_split_2);
                        let config_result = '';
                        for (let j = 0; j < config_split_2.length; j++) {
                            if ("" !== config_split_2[j]) {
                                config_result = config_split_2[j];
                                console.log(config_result);
                                break;
                            }
                        }
                        buildCompileJsonFile("CONFIGURE", config_result, compileFile);
                        break;
                    }
                }
                if (!existCounfigureTarget) {
                    vscode.window.showErrorMessage("Cannot check CONFIGURE file target.");
                    return false;
                }
            }
        }
        else {
            vscode.window.showInformationMessage("Use owner configure.");
            return false;
        }
        // const test_info = '';
        // fs.writeFileSync(compileFile, test_info);
        return true;
    }
}
function buildCompileJsonFileBase(mode, target_path, compile_file_path, config_file) {
    console.log("[buildCompileJsonFileBase]");
    const myDate = new Date();
    var mytime = myDate.toLocaleString();
    //mode: CMAKE target path: exe file
    const test_info = {
        mode: mode,
        config_file: config_file,
        target_path: target_path,
        time: mytime
    };
    const test_info_json = JSON.stringify(test_info);
    fs.writeFileSync(compile_file_path, test_info_json);
}
function buildCompileJsonFile(mode, target_path, compile_file_path) {
    console.log("[buildCompileJsonFile]");
    let vsrootPath = vscode.workspace.rootPath;
    if (vsrootPath) {
        const vscodefile = path.join(vsrootPath, ".vscode");
        const configure_file = path.join(vscodefile, "coufigure.txt");
        if (!fs.existsSync(vscodefile)) {
            fs.mkdirSync(vscodefile);
        }
        if (!fs.existsSync(configure_file)) {
            // cp extension configure,json file to project .vscode/configure.json
            const configure_txt = path.join(__dirname, "../configure/configure.txt");
            copyFile(configure_txt, configure_file);
        }
        buildCompileJsonFileBase(mode, target_path, compile_file_path, configure_file);
    }
    else {
        vscode.window.showErrorMessage("buildCompileJsonFile rootPath show null");
    }
}
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
//# sourceMappingURL=extension.js.map