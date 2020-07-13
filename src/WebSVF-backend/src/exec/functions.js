import fs from 'fs';
import ncp from 'ncp';
import execa from 'execa';
import execao from 'execa-output';
import chalk from 'chalk';
import Listr from 'listr';
import path from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';

const copy = promisify(ncp);

String.prototype.endWith = function (endStr) {
  var d = this.length - endStr.length;
  return d >= 0 && this.lastIndexOf(endStr) == d;
};

export function installSVF(dirPresence, options, scriptsPath) {
  return new Listr(
    [
      {
        title: `Installing ${chalk.inverse(chalk.blue('SVF Dependencies'))}`,
        enabled: () => true,
        task: () => {
          return new Listr(
            [
              {
                title: `Updating ${chalk.blue('Ubuntu Packages')}`,
                enabled: () => true,
                task: () =>
                  updatePackages()
                    .then(() => {})
                    .catch((e) => {
                      console.error(
                        `${chalk.inverse(
                          `Something went wrong updating ${chalk.red.bold(
                            'Ubuntu Packages'
                          )}${'\n'.repeat(
                            2
                          )} Please Run the command ${chalk.green.italic(
                            'sudo create-analysis'
                          )} again to finish setting up  ${'\n'.repeat(
                            2
                          )} The Error Log from the failed installation:`
                        )}`
                      );
                      console.error(e);
                      process.exit(1);
                    }),
              },
              {
                title: `Installing ${chalk.blue(
                  'Essential Tools'
                )}\n\t  ${chalk.yellow('Please wait...')}`,
                enabled: () => true,
                task: () =>
                  installSVFEssentialTools()
                    .then(() => {})
                    .catch((e) => {
                      console.error(
                        `${chalk.inverse(
                          `Something went wrong installing ${chalk.red.bold(
                            'Essential Tools for SVF Installation'
                          )}${'\n'.repeat(
                            2
                          )} Please Run the command ${chalk.green.italic(
                            'sudo create-analysis'
                          )} again to finish setting up  ${'\n'.repeat(
                            2
                          )} The Error Log from the failed installation:`
                        )}`
                      );
                      console.error(e);
                      process.exit(1);
                    }),
              },
              {
                title: `Installing ${chalk.blue('WLLVM and pygraphviz')}`,
                enabled: () => true,
                task: () =>
                  installSVFDependencies()
                    .then(() => {})
                    .catch((e) => {
                      console.error(
                        `${chalk.inverse(
                          `Something went wrong installing ${chalk.red.bold(
                            'WLLVM and pygraphviz'
                          )}${'\n'.repeat(
                            2
                          )} Please Run the command ${chalk.green.italic(
                            'sudo create-analysis'
                          )} again to finish setting up  ${'\n'.repeat(
                            2
                          )} The Error Log from the failed installation:`
                        )}`
                      );
                      console.error(e);
                      process.exit(1);
                    }),
              },
            ],
            { concurrent: false }
          );
        },
      },
      {
        title: `Creating ${chalk.inverse.blue('SVF-Tools')} directory`,
        enabled: () => !dirPresence.svfToolsR,
        skip: () => !dirPresence.homeW,
        task: () =>
          createSVFToolsDirectory(options.account)
            .then(() => {})
            .catch((e) => {
              console.error(
                `${chalk.inverse(
                  `Something went wrong creating ${chalk.red.bold(
                    'SVF-Tools'
                  )} directory${'\n'.repeat(
                    2
                  )} Please Run the command ${chalk.green.italic(
                    'sudo create-analysis'
                  )} again to finish setting up  ${'\n'.repeat(
                    2
                  )} The Error Log from the failed installation:`
                )}`
              );
              console.error(e);
              process.exit(1);
            }),
      },
      {
        title: `Downloading ${chalk.inverse.blue('LLVM-Clang 10.0')} binary`,
        enabled: () => !dirPresence.llvmclangUnpack && !dirPresence.llvmclang,
        skip: () => !dirPresence.homeW,
        task: () =>
          execao(
            'wget',
            [
              '-c',
              'https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz',
            ],
            {
              cwd: `/home/${options.account}/SVFTools/`,
            }
          ),
      },
      {
        title: `Downloading ${chalk.inverse.blue('SVF')} binary`,
        enabled: () => !dirPresence.svfR,
        skip: () => !dirPresence.homeW,
        task: () =>
          execao(
            'wget',
            [
              '-c',
              'https://github.com/SVF-tools/WebSVF/releases/download/1.0/SVF.tar.xz',
            ],
            {
              cwd: `/home/${options.account}/SVFTools/`,
            }
          ),
      },
      {
        title: `Unpacking ${chalk.inverse.blue('LLVM-Clang 10.0')} binary`,
        enabled: () => !dirPresence.llvmclangUnpack && !dirPresence.llvmclang,
        skip: () => !dirPresence.homeW,
        task: () =>
          execao(
            'tar',
            [
              '-xvf',
              'clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz',
              '-C',
              `/home/${options.account}/SVFTools/`,
            ],
            {
              cwd: `/home/${options.account}/SVFTools/`,
            },
            (result) => {
              dirPresence.llvmclangUnpack = true;
            }
          ),
      },
      {
        title: `Renaming ${chalk.inverse.blue('LLVM-Clang')} directory`,
        enabled: () => !dirPresence.llvmclang && dirPresence.llvmclangUnpack,
        skip: () => !dirPresence.homeW,
        task: () =>
          execao(
            'mv',
            [
              `/home/${options.account}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`,
              `/home/${options.account}/SVFTools/clang-llvm`,
            ],
            {
              cwd: `/home/${options.account}/SVFTools/`,
            },
            (result) => {
              dirPresence.llvmclang = true;
            }
          ),
      },
      {
        title: `Unpacking ${chalk.inverse.blue('SVF')} binary`,
        enabled: () => !dirPresence.svfR,
        skip: () => !dirPresence.homeW,
        task: () =>
          execao(
            'tar',
            ['-xvf', 'SVF.tar.xz', '-C', `/home/${options.account}/SVFTools/`],
            {
              cwd: `/home/${options.account}/SVFTools/`,
            },
            (result) => {
              dirPresence.svfR = true;
            }
          ),
      },
      {
        title: `Setting PATHs for ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
        enabled: () => true,
        task: () =>
          execao(
            'cp',
            ['-f', 'setupSVF.sh', `/home/${options.account}/SVFTools/`],
            {
              cwd: scriptsPath,
            },
            (result) => {
              fs.readFile(
                `/home/${options.account}/SVFTools/setupSVF.sh`,
                (err, data) => {
                  if (err) {
                    throw err;
                  }
                  const dataSplit = data
                    .toString()
                    .replace(
                      '#########',
                      `########\nINSTALL_DIR="/home/${options.account}/SVFTools"`
                    )
                    .replace(/\r\n/gm, '\n');

                  fs.writeFile(
                    `/home/${options.account}/SVFTools/setupSVF.sh`,
                    `${dataSplit}`,
                    (err) => {
                      if (err) throw err;

                      execao(
                        'sh',
                        ['setupSVF.sh'],
                        {
                          cwd: `/home/${options.account}/SVFTools/`,
                        },
                        (result) => {
                          console.error(
                            `${chalk.inverse.green(
                              'SUCCESS'
                            )}: Please RESTART your system to finish Installation`
                          );
                          execao(
                            'rm',
                            [
                              '-rf',
                              'clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz',
                              `SVF.tar.xz`,
                              'setupSVF.sh',
                            ],
                            {
                              cwd: `/home/${options.account}/SVFTools/`,
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          ),
      },
    ],
    { concurrent: false }
  );
}

export function uninstallComponents(options, scriptsPath) {
  return new Listr(
    [
      {
        title: `Removing ${chalk.blue('Extension files')}`,
        enabled: () => true,
        task: () =>
          execao(
            'rm',
            [
              '-rf',
              'WebSVF-frontend-extension',
              'codemap-extension',
              'codemap-extension-0.0.1/',
              'WebSVF-frontend-extension_0.9.0/',
            ],
            {
              cwd: `/home/${options.account}/.vscode/extensions`,
            }
          ),
      },
      {
        title: `Removing ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
        enabled: () => true,
        task: () =>
          execao(
            'cp',
            ['-f', 'removeSVF.sh', `/home/${options.account}/SVFTools/`],
            {
              cwd: scriptsPath,
            },
            (result) => {
              fs.readFile(
                `/home/${options.account}/SVFTools/removeSVF.sh`,
                (err, data) => {
                  if (err) {
                    throw err;
                  }
                  const dataSplit = data
                    .toString()
                    .replace(
                      '#########',
                      `########\nINSTALL_DIR="/home/${options.account}/SVFTools"`
                    )
                    .replace(/\r\n/gm, '\n');

                  fs.writeFile(
                    `/home/${options.account}/SVFTools/removeSVF.sh`,
                    `${dataSplit}`,
                    (err) => {
                      if (err) throw err;

                      execao(
                        'sh',
                        ['removeSVF.sh'],
                        {
                          cwd: `/home/${options.account}/SVFTools/`,
                        },
                        (result) => {
                          console.error(
                            `${chalk.inverse.green(
                              'SUCCESS'
                            )}: WebSVF Uninstalled`
                          );
                          execao('rm', ['-rf', 'SVFTools', '.bug-report'], {
                            cwd: `/home/${options.account}`,
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          ),
      },
    ],
    { concurrent: false }
  );
}

export async function whichbc(bcFileList) {
  const questions = [];

  let defaultbc = bcFileList.filter((e) => e.charAt(0) !== '.');

  questions.push({
    type: 'list',
    name: 'selection',
    message: 'Please choose which .bc file to use for generating CodeMap:',
    choices: bcFileList,
    default: defaultbc || bcFileList[0],
  });

  const answers = await inquirer.prompt(questions);
  return answers.selection;
}

export async function installDependencies(dependency) {
  let result;
  if (dependency === 'code') {
    result = await execa('sudo', ['snap', 'install', '--classic', dependency]);
  } else {
    result = await execa('sudo', ['apt', 'install', '-y', dependency]);
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
  const result = await execa('sudo', ['apt-get', 'update']);
  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to update ${chalk.yellow.bold('Ubuntu Packages')}`)
    );
  }
  return;
}

export async function download(dir, link) {
  return execaout('wget', ['-c', link], {
    cwd: dir,
  });
}

export async function installSVFEssentialTools() {
  const result = await execa('sudo', [
    'apt-get',
    'install',
    '-y',
    'curl',
    'gcc',
    'gdb',
    'build-essential',
    'cmake',
    'wget',
    'libtinfo-dev',
    'libtinfo5',
    'libglib2.0-dev',
    'libncurses5',
    'libtool',
    'libgraphviz-dev',
    'graphviz',
    'python3-pip',
  ]); //'libtinfo6',
  if (result.failed) {
    return Promise.reject(
      new Error(
        `Failed to install ${chalk.yellow.bold(
          'Essential Tools for SVF Installation'
        )}`
      )
    );
  }
  return;
}

export async function installSVFDependencies() {
  const result = await execa('sudo', [
    'pip3',
    'install',
    'wllvm',
    'pygraphviz',
  ]);
  if (result.failed) {
    return Promise.reject(
      new Error(
        `Failed to install ${chalk.yellow.bold('WLLVM and pygraphviz')}`
      )
    );
  }
  return;
}

export async function installVSCodeDependencies() {
  const result = await execa('sudo', ['apt', 'install', '-y', 'wget']);
  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to install ${chalk.yellow.bold('VSCode Dependencies')}`)
    );
  }
  return;
}

export async function createSVFToolsDirectory(user) {
  const result = await execa('mkdir', ['-m', 'a=rwx', 'SVFTools'], {
    cwd: `/home/${user}`,
  });

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to remove ${chalk.yellow.bold('VSCode Install File')}`)
    );
  }
  return;
}

export async function generateJSON(path, projectDir) {
  const result = await execa.node(`${path}generateJSON.js`, [`${projectDir}`]);

  if (result.failed) {
    return Promise.reject(
      new Error(`Failed to install ${chalk.yellow.bold('SVF')}`)
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
    if (element.endWith('.bc')) {
      bcFilesList.push(element);
    }
  });

  return bcFilesList;
}
