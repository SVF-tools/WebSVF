import chalk from 'chalk';
import Listr from 'listr';
import path from 'path';
import { promisify } from 'util';
import execao from 'execa-output';
import commandExists from 'command-exists';
import fs from 'fs';
import { projectInstall } from 'pkg-install';
import {
  createSVFToolsDirectory,
  installDependencies,
  installSVFEssentialTools,
  installSVFDependencies,
  updatePackages,
  scanbc,
  whichbc,
  uninstallComponents,
  installSVF,
} from './exec/functions';

const access = promisify(fs.access);

export async function createAnalysis(options) {
  //A JavaScript object containing boolean values representing whether a particular depndency is installed or not
  const depInstall = {
    vscode: false,
    node: false,
    nodeVers: false,
    npm: false,
    git: false,
    svf: false,
  };

  const dirPresence = {
    svfToolsR: true,
    homeW: true,
    svfR: true,
    llvmclangUnpack: true,
    llvmclang: true,
    codemap: true,
    frontend: true,
    frontendServer: true,
    extDir: true,
  };

  try {
    await access(`/home/${options.account}/.bug-report`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.frontendServer = false;
  }

  try {
    await access(`/home/${options.account}/SVFTools`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.svfToolsR = false;
  }

  try {
    await access(`/home/${options.account}/SVFTools/SVF`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.svfR = false;
  }

  try {
    await access(
      `/home/${options.account}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`,
      fs.constants.R_OK
    );
  } catch (err) {
    dirPresence.llvmclangUnpack = false;
  }

  try {
    await access(
      `/home/${options.account}/SVFTools/clang-llvm`,
      fs.constants.R_OK
    );
  } catch (err) {
    dirPresence.llvmclang = false;
  }

  try {
    await access(`/home/${options.account}`, fs.constants.W_OK);
  } catch (err) {
    dirPresence.homeW = false;
  }

  try {
    await access(
      `/home/${options.account}/.vscode/extensions/codemap-extension`,
      fs.constants.R_OK
    );
  } catch (err) {
    dirPresence.codemap = false;
  }

  try {
    await access(
      `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension`,
      fs.constants.R_OK
    );
  } catch (err) {
    dirPresence.frontend = false;
  }

  try {
    await access(
      `/home/${options.account}/.vscode/extensions`,
      fs.constants.R_OK
    );
  } catch (err) {
    dirPresence.extDir = false;
  }

  if (dirPresence.llvmclang && dirPresence.svfR) {
    depInstall.svf = true;
  }

  let currentFileUrl = import.meta.url;
  let scriptsPath =
    '/' +
    path.join(
      decodeURI(
        new URL(currentFileUrl).pathname.substring(
          new URL(currentFileUrl).pathname.indexOf('/') + 1
        )
      ),
      '../../scripts'
    );

  let srcPath =
    '/' +
    path.join(
      decodeURI(
        new URL(currentFileUrl).pathname.substring(
          new URL(currentFileUrl).pathname.indexOf('/') + 1
        )
      ),
      '../'
    );

  //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking Dependency Installations',
      enabled: () => !options.runUnInstall,
      task: () => {
        return new Listr(
          [
            {
              title: `Checking ${chalk.inverse('NPM')} Installation`,
              enabled: () => true,
              task: () =>
                commandExists('npm')
                  .then(() => {
                    depInstall.npm = true;
                  })
                  .catch(() => {
                    console.error(
                      `${chalk.inverse(
                        `${chalk.blue.bold(
                          'npm'
                        )} command not found${'\n'.repeat(
                          2
                        )} Please install ${chalk.blue.bold(
                          'NodeJS'
                        )} version ${chalk.yellow.bold('>=10')} ${'\n'.repeat(
                          2
                        )} Then Run the command ${chalk.green.italic(
                          'sudo create-analysis'
                        )} again to finish setting up`
                      )}`
                    );
                    process.exit(1);
                  }),
            },
            {
              title: `Checking ${chalk.inverse('NodeJS')} Installation`,
              enabled: () => true,
              task: () =>
                commandExists('node')
                  .then(() => {
                    depInstall.node = true;
                  })
                  .catch(() => {
                    console.error(
                      `${chalk.inverse(
                        `${chalk.blue.bold(
                          'node'
                        )} command not found${'\n'.repeat(
                          2
                        )} Please install ${chalk.blue.bold(
                          'NodeJS'
                        )} version ${chalk.yellow.bold('>=10')} ${'\n'.repeat(
                          2
                        )} Then Run the command ${chalk.green.italic(
                          'sudo create-analysis'
                        )} again to finish setting up`
                      )}`
                    );
                    process.exit(1);
                  }),
            },
            {
              title: `Checking ${chalk.inverse('NodeJS')} Version`,
              enabled: () => true,
              task: () => {
                const version = process.version;
                if (parseFloat(version.substr(1, version.length)) >= 10) {
                  depInstall.nodeVers = true;
                } else {
                  console.error(
                    `${chalk.inverse(
                      `The current version of node ${chalk.blue.bold(
                        version
                      )} is outdated${'\n'.repeat(
                        2
                      )}Please Update node to version ${chalk.yellow.bold(
                        '>=10'
                      )} ${'\n'.repeat(
                        2
                      )} Then Run the command ${chalk.green.italic(
                        'sudo create-analysis'
                      )} again to finish setting up`
                    )}`
                  );
                  process.exit(1);
                }
              },
            },
            {
              title: `Checking ${chalk.inverse('VSCode')} Installation`,
              enabled: () => true,
              task: () =>
                commandExists('code')
                  .then(() => {
                    depInstall.vscode = true;
                  })
                  .catch(() => {}),
            },
            {
              title: `Checking ${chalk.inverse('Git')} Installation`,
              enabled: () => true,
              task: () =>
                commandExists('git')
                  .then(() => {
                    depInstall.git = true;
                  })
                  .catch(() => {}),
            },
          ],
          { concurrent: false }
        );
      },
    },
    {
      title: 'Installing Dependencies',
      enabled: () => options.runInstall,
      skip: () => {
        if (
          depInstall.vscode === true &&
          depInstall.npm === true &&
          depInstall.node === true &&
          depInstall.git === true &&
          depInstall.nodeVers === true
        ) {
          return true;
        }
      },
      task: () => {
        return new Listr(
          [
            {
              title: `Installing ${chalk.inverse(
                'VSCode'
              )} (using snap package manager)`,
              enabled: () => true,
              skip: () => depInstall.vscode,
              task: () =>
                execao('snap', ['install', 'code', '--classic'], null, () => {
                  depInstall.vscode = true;
                }),
            },
            {
              title: `Installing ${chalk.inverse('Git')}`,
              enabled: () => true,
              skip: () => depInstall.git,
              task: () =>
                installDependencies('git')
                  .then(() => {
                    depInstall.git = true;
                  })
                  .catch((e) => {
                    console.error(
                      `${chalk.inverse(
                        `Something went wrong installing ${chalk.red.bold(
                          'Git'
                        )}${'\n'.repeat(
                          2
                        )} Please Run the command ${chalk.green.italic(
                          'sudo create-analysis --install'
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
              title: `Installing ${chalk.inverse('Unzip')}`,
              enabled: () => true,
              //skip: () => depInstall.git,
              task: () => execao('sudo', ['apt', 'install', '-y', 'unzip']),
            },
          ],
          { concurrent: false }
        );
      },
    },
    {
      title: `Installing ${chalk.inverse('WebSVF frontend-server')}`,
      enabled: () => !dirPresence.frontendServer && options.runInstall,
      //skip: () => !options.runInstall,
      task: () => {
        return new Listr(
          [
            {
              title: `Downloading ${chalk.inverse('WebSVF-frontend-server')}`,
              enabled: () => true,
              skip: () => !options.runInstall,
              task: () =>
                execao('wget', [
                  '-c',
                  'https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/bug_analyis_front-end-0.0.9.tgz',
                ]),
            },
            {
              title: `Making directory ${chalk.blue('.bug-report')}`,
              enabled: () => true,
              //skip: () => !options.runInstall,
              task: () =>
                execao('mkdir', ['-m', 'a=rwx', '.bug-report'], {
                  cwd: `/home/${options.account}`,
                }),
            },
            {
              title: `Unpacking ${chalk.inverse.blue(
                'WebSVF-frontend-server'
              )} files`,
              enabled: () => true,
              skip: () => !dirPresence.homeW,
              task: () =>
                execao(
                  'mv',
                  [
                    '-f',
                    `bug_analyis_front-end-0.0.9.tgz`,
                    `/home/${options.account}/.bug-report/bug_analyis_front-end-0.0.9.tgz`,
                  ],
                  null,
                  (result) => {
                    execao(
                      'tar',
                      ['-xzvf', 'bug_analyis_front-end-0.0.9.tgz'],
                      {
                        cwd: `/home/${options.account}/.bug-report/`,
                      },
                      (result) => {
                        execao(
                          'find',
                          [
                            'package',
                            '-maxdepth',
                            '1',
                            '-mindepth',
                            '1',
                            '-exec',
                            'mv',
                            '{}',
                            '.',
                            ';',
                          ],
                          {
                            cwd: `/home/${options.account}/.bug-report/`,
                          }
                        );
                      }
                    );
                  }
                ),
            },
            {
              title: `Installing ${chalk.inverse.blue(
                'WebSVF-frontend-server'
              )}`,
              enabled: () => true,
              skip: () => !dirPresence.homeW,
              task: () =>
                projectInstall({
                  cwd: `/home/${options.account}/.bug-report/`,
                }),
            },
            {
              title: `Granting the user access to files`,
              enabled: () => true,
              skip: () => !options.runInstall,
              task: () =>
                execao('chmod', [
                  '-R',
                  'u=rwx,g=rwx,o=rwx',
                  `/home/${options.account}/.bug-report/`,
                ]),
            },
            {
              title: `Removing ${chalk.blue('Installation files')}`,
              enabled: () => true,
              skip: () => !options.runInstall,
              task: () => {
                execao('rm', ['-rf', 'bug_analyis_front-end-0.0.9.tgz'], {
                  cwd: `/home/${options.account}/.bug-report/`,
                });
                execao('rm', ['-rf', 'package/'], {
                  cwd: `/home/${options.account}/.bug-report/`,
                });
              },
            },
          ],
          { concurrent: false }
        );
      },
    },
    {
      title: `Installing ${chalk.inverse('WebSVF Extensions')}`,
      enabled: () =>
        depInstall.vscode && !dirPresence.frontend && options.runInstall,
      //skip: () => !options.runInstall,
      task: () => {
        return new Listr(
          [
            {
              title: `Downloading ${chalk.inverse(
                'WebSVF-frontend-extension'
              )}`,
              enabled: () => depInstall.vscode && !dirPresence.frontend,
              skip: () => !options.runInstall,
              task: () =>
                execao('wget', [
                  '-c',
                  'https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/WebSVF-frontend-extension_0.9.0.vsix',
                ]),
            },
            {
              title: `Downloading ${chalk.inverse('WebSVF-codemap-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao('wget', [
                  '-c',
                  'https://github.com/SVF-tools/WebSVF/releases/download/0.0.1/codemap-extension-0.0.1.vsix',
                ]),
            },
            {
              title: `Making directory ${chalk.blue('VSCode Extensions')}`,
              enabled: () => !dirPresence.extDir,
              //skip: () => !options.runInstall,
              task: () =>
                execao('mkdir', ['-m', 'a=rwx', '.vscode'], {
                  cwd: `/home/${options.account}`,
                }),
            },
            {
              title: `Making directory ${chalk.blue('VSCode Extensions')}`,
              enabled: () => !dirPresence.extDir,
              //skip: () => !options.runInstall,
              task: () =>
                execao('mkdir', ['-m', 'a=rwx', '-p', 'extensions'], {
                  cwd: `/home/${options.account}/.vscode`,
                }),
            },
            {
              title: `Moving ${chalk.blue('WebSVF-frontend-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.frontend,
              //skip: () => !options.runInstall,
              task: () =>
                execao('mv', [
                  '-f',
                  'WebSVF-frontend-extension_0.9.0.vsix',
                  `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0.zip`,
                ]),
            },
            {
              title: `Moving ${chalk.blue('WebSVF-codemap-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao('mv', [
                  '-f',
                  'codemap-extension-0.0.1.vsix',
                  `/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1.zip`,
                ]),
            },
            {
              title: `Making directory ${chalk.blue(
                'WebSVF-codemap-extension'
              )}`,
              enabled: () => depInstall.vscode && !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao('mkdir', ['-m', 'a=rwx', 'codemap-extension-0.0.1'], {
                  cwd: `/home/${options.account}/.vscode/extensions`,
                }),
            },
            {
              title: `Making directory ${chalk.blue(
                'WebSVF-frontend-extension'
              )}`,
              enabled: () => depInstall.vscode && !dirPresence.frontend,
              skip: () => !options.runInstall,
              task: () =>
                execao(
                  'mkdir',
                  ['-m', 'a=rwx', 'WebSVF-frontend-extension_0.9.0'],
                  {
                    cwd: `/home/${options.account}/.vscode/extensions`,
                  }
                ),
            },
            {
              title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao(
                  'unzip',
                  [
                    'codemap-extension-0.0.1.zip',
                    '-d',
                    `/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1`,
                  ],
                  {
                    cwd: `/home/${options.account}/.vscode/extensions`,
                  }
                ),
            },
            {
              title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.frontend,
              skip: () => !options.runInstall,
              task: () =>
                execao(
                  'unzip',
                  [
                    'WebSVF-frontend-extension_0.9.0.zip',
                    '-d',
                    `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0`,
                  ],
                  {
                    cwd: `/home/${options.account}/.vscode/extensions`,
                  }
                ),
            },
            {
              title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao('mv', [
                  '-f',
                  `/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1/extension/`,
                  `/home/${options.account}/.vscode/extensions/codemap-extension/`,
                ]),
            },
            {
              title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
              enabled: () => depInstall.vscode && !dirPresence.frontend,
              skip: () => !options.runInstall,
              task: () =>
                execao('mv', [
                  '-f',
                  `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0/extension/`,
                  `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension/`,
                ]),
            },
            {
              title: `Allowing ${chalk.blue('access to extensions')}`,
              enabled: () =>
                depInstall.vscode &&
                !dirPresence.frontend &&
                !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () => {
                execao('chmod', [
                  '-R',
                  'u=rwx,g=rwx,o=rwx',
                  `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension/`,
                ]);
                execao('chmod', [
                  '-R',
                  'u=rwx,g=rwx,o=rwx',
                  `/home/${options.account}/.vscode/extensions/codemap-extension/`,
                ]);
              },
            },
            {
              title: `Removing ${chalk.blue('Extension files')}`,
              enabled: () =>
                depInstall.vscode &&
                !dirPresence.frontend &&
                !dirPresence.codemap,
              skip: () => !options.runInstall,
              task: () =>
                execao(
                  'rm',
                  [
                    '-rf',
                    'WebSVF-frontend-extension_0.9.0.zip',
                    'codemap-extension-0.0.1.zip',
                    'WebSVF-frontend-extension_0.9.0/',
                    'codemap-extension-0.0.1/',
                  ],
                  {
                    cwd: `/home/${options.account}/.vscode/extensions`,
                  }
                ),
            },
          ],
          { concurrent: false }
        );
      },
    },
    {
      title: `Installing ${chalk.inverse('SVF')}`,
      enabled: () => options.runInstall,
      skip: () => depInstall.svf,
      task: () => installSVF(dirPresence, options, scriptsPath),
    },
    {
      title: `Uninstalling ${chalk.inverse('WebSVF')}`,
      enabled: () => options.runUnInstall,
      skip: () => !depInstall.svf,
      task: () => uninstallComponents(options, scriptsPath),
    },
    {
      title: `Generating files for ${chalk.yellow.bold('WebSVF-frontend')}`,
      enabled: () => !options.runInstall && !options.runUnInstall,
      //skip: () => depInstall.svf,
      task: () =>
        execao(
          'node',
          [`${srcPath}generateJSON.js`, `${options.generateJSONDir}`],
          null,
          () => {}
        ),
    },
    {
      title: `Generating files ${chalk.yellow.bold(
        'WebSVF-codemap-extension'
      )}`,
      enabled: () => !options.runInstall && !options.runUnInstall,
      skip: () => depInstall.svf,
      task: () => {
        var bcFilesList = scanbc(`${options.generateJSONDir}`);
        var select = whichbc(bcFilesList);

        return new Listr([
          {
            title: `Moving Files for ${chalk.yellow.bold(
              'WebSVF-codemap-extension'
            )}`,
            enabled: () => !options.runInstall && !options.runUnInstall,
            task: () =>
              execao(
                'cp',
                [
                  `-t`,
                  `${options.generateJSONDir}`,
                  'CodeMap.sh',
                  'Bc2Dot.sh',
                  'Dot2Json.py',
                ],
                {
                  cwd: scriptsPath,
                },
                () => {}
              ),
          },
          {
            title: `Generating Graphs for ${chalk.yellow.bold(
              'WebSVF-codemap-extension'
            )}`,
            enabled: () => !options.runInstall && !options.runUnInstall,
            task: () =>
              execao(
                'bash',
                [`CodeMap.sh`, select],
                {
                  cwd: options.generateJSONDir,
                },
                () => {}
              ),
          },
          {
            title: `Removing files for ${chalk.yellow.bold(
              'WebSVF-codemap-extension'
            )}`,
            enabled: () => !options.runInstall && !options.runUnInstall,
            task: () =>
              execao(
                'rm',
                [`-rf`, 'CodeMap.sh', 'Bc2Dot.sh', 'Dot2Json.py'],
                {
                  cwd: options.generateJSONDir,
                },
                () => {}
              ),
          },
        ]);
      },
    },
  ]);

  //Run the list of tasks defined above
  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
  }

  if (!options.runInstall && !options.runUnInstall) {
  }

  //console.log(depInstall);
  //console.log(dirPresence);

  return true;
}
