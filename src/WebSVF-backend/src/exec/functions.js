import fs from "fs";
import ncp from "ncp";
import execa from "execa";
import chalk from "chalk";
import path from "path";
import { promisify } from "util";
import inquirer from 'inquirer';


String.prototype.endWith = function (endStr) {
  var d = this.length - endStr.length;
  return d >= 0 && this.lastIndexOf(endStr) == d;
};

const copy = promisify(ncp);
const access = promisify(fs.access);

export async function whichbc(bcFileList) {
  const questions = [];

  let defaultbc = bcFileList.filter((e)=>(e.charAt(0)!=='.'))

  questions.push({
    type: "list",
    name: "selection",
    message: "Please choose which .bc file to use for generating CodeMap:",
    choices: bcFileList,
    default: defaultbc || bcFileList[0],
  });

  const answers = await inquirer.prompt(questions);
  return answers.selection;
}

export async function installDependencies(dependency) {
  let result;
  if (dependency === "code") {
    result = await execa("sudo", ["snap", "install", "--classic", dependency]);
  } else {
    result = await execa("sudo", ["apt", "install", "-y", dependency]);
  }

  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${dependency}`));
  }
  return;
}

export async function copyFiles(from, to) {
  return copy(from, to, {
    clobber: true,
  });
}

export async function updatePackages() {
  const result = await execa("sudo", ["apt-get", "update"]);
  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to update ${chalk.yellow.bold("Ubuntu Packages")}`)
    );
  }
  return;
}

export async function download(dir, link) {
  return execaout("wget", ["-c", link], {
    cwd: dir,
  });
}

export async function installSVFEssentialTools() {
  const result = await execa("sudo", [
    "apt-get",
    "install",
    "-y",
    "curl",
    "gcc",
    "gdb",
    "build-essential",
    "cmake",
    "wget",
    "libtinfo-dev",
    "libtinfo5",
    "libtinfo6",
    "libglib2.0-dev",
    "libncurses5",
    "libtool",
    "libgraphviz-dev",
    "graphviz",
    "python3-pip",
  ]); //'libtinfo6',
  if (result.failed) {
    return Promise.reject(
      new Error(
        `Failed to install ${chalk.yellow.bold(
          "Essential Tools for SVF Installation"
        )}`
      )
    );
  }
  return;
}

export async function installSVFDependencies() {
  const result = await execa("sudo", [
    "pip3",
    "install",
    "wllvm",
    "pygraphviz",
  ]);
  if (result.failed) {
    return Promise.reject(
      new Error(
        `Failed to install ${chalk.yellow.bold("WLLVM and pygraphviz")}`
      )
    );
  }
  return;
}

export async function installVSCodeDependencies() {
  const result = await execa("sudo", ["apt", "install", "-y", "wget"]);
  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to install ${chalk.yellow.bold("VSCode Dependencies")}`)
    );
  }
  return;
}

export async function installVSCode() {
  const result = await execa("sudo", [
    "apt",
    "install",
    "-y",
    "./code_1.45.1-1589445302_amd64.deb",
  ]);

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to install ${chalk.yellow.bold("VSCode")}`)
    );
  }
  return;
}

export async function removeInstallFiles() {
  const result = await execa("sudo", [
    "rm",
    "-rf",
    "./code_1.45.1-1589445302_amd64.deb",
  ]);

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to remove ${chalk.yellow.bold("VSCode Install File")}`)
    );
  }
  return;
}

export async function createSVFToolsDirectory(user) {
  const result = await execa("mkdir", ["-m", "a=rwx", "SVFTools"], {
    cwd: `/home/${user}`,
  });

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to remove ${chalk.yellow.bold("VSCode Install File")}`)
    );
  }
  return;
}

export async function generateJSON(path, projectDir) {
  const result = execa.node(`${path}generateJSON.js`, [`${projectDir}`]);

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to install ${chalk.yellow.bold("SVF")}`)
    );
  }
  return;
}

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    filesList.push(fullPath);
  });
  return filesList;
}

function readAllFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);
    } else {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

export function scanbc(dir) {
  var bcFilesList = [];

  var filesList = [];
  var filesDir = dir;
  readFileList(filesDir, filesList);
  var allFilesList = [];
  readAllFileList(filesDir, allFilesList);
  filesList.forEach((element) => {
    if (element.endWith(".bc")) {
      bcFilesList.push(element);
    }
  });

  return bcFilesList;
}
