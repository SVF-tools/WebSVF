import getos from 'getos';
import chalk from 'chalk';
import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import { promisify } from 'util';
import execao from 'execa-output';
import commandExists from 'command-exists';
import fs from 'fs';
import ncp from 'ncp';
import { projectInstall } from 'pkg-install';

const copy = promisify(ncp);
const access = promisify(fs.access);

async function installDependencies(dependency) {
  let result;
  if(dependency==='code'){
    result = await execa('sudo', ['snap','install', '--classic', dependency ]);
  }
  else{
    result = await execa('sudo', ['apt','install','-y', dependency]);
  }
  
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${dependency}`));
  }
  return;
}

async function copyFiles(from,to) {
  return copy(from, to, {
    clobber: true,
  });
 }

async function updatePackages() {
  const result = await execa('sudo', ['apt-get', 'update']);
  if (result.failed) {
    return Promise.reject(new Error(`Failed to update ${chalk.yellow.bold('Ubuntu Packages')}`));
  }
  return;
}

async function download(dir, link) {
  return execaout('wget', ['-c', link],{
    cwd: dir
  });
 }

async function installSVFEssentialTools() {
  const result = await execa('sudo', ['apt-get', 'install', '-y' , 'curl', 'gcc', 'gdb', 'build-essential', 'cmake', 'wget', 'libtinfo-dev', 'libtinfo5', 'libtinfo6', 'libglib2.0-dev', 'libncurses5', 'libtool', 'libgraphviz-dev', 'graphviz', 'python3-pip']); //'libtinfo6',
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('Essential Tools for SVF Installation')}`));
  }
  return;
}

async function installSVFDependencies() {
  const result = await execa('sudo', ['pip3', 'install', 'wllvm', 'pygraphviz']);
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('WLLVM and pygraphviz')}`));
  }
  return;
}

async function installVSCodeDependencies() {
  const result = await execa('sudo', ['apt', 'install', '-y', 'wget']);
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('VSCode Dependencies')}`));
  }
  return;
}

async function installVSCode() {
  const result = await execa('sudo', ['apt', 'install', '-y', './code_1.45.1-1589445302_amd64.deb']);

  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('VSCode')}`));
  }
  return;
}

async function removeInstallFiles() {
  const result = await execa('sudo', ['rm', '-rf', './code_1.45.1-1589445302_amd64.deb']);

  if (result.failed) {
    return Promise.reject(new Error(`Failed to remove ${chalk.yellow.bold('VSCode Install File')}`));
  }
  return;
}

async function createSVFToolsDirectory(user) {
  const result = await execa('mkdir', ['-m', 'a=rwx','SVFTools'],{
    cwd: `/home/${user}`,
  });

  if (result.failed) {
    return Promise.reject(new Error(`Failed to remove ${chalk.yellow.bold('VSCode Install File')}`));
  }
  return;
}

async function generateJSON(path, projectDir) {
  const result = execa.node(`${path}generateJSON.js`, [ `${projectDir}` ] );

  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('SVF')}`));
  }
  return;
}

export async function createAnalysis(options) {

  //A JavaScript object containing boolean values representing whether a particular depndency is installed or not
  const depInstall = {
    vscode: false,
    node: false,
    nodeVers: false,
    npm: false,
    git: false,
    svf: false
  }

  const dirPresence = {
    svfToolsR: true,
    homeW: true,
    svfR: true,
    llvmclangUnpack: true,
    llvmclang: true,
    codemap: true,
    frontend: true,
    frontendServer: true,
    extDir: true
  }
  

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
    await access(`/home/${options.account}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.llvmclangUnpack = false;
  }

  try {
    await access(`/home/${options.account}/SVFTools/clang-llvm`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.llvmclang = false;
  }

  try {
    await access(`/home/${options.account}`, fs.constants.W_OK);
  } catch (err) {
    dirPresence.homeW = false;
  }

  try {
    await access(`/home/${options.account}/.vscode/extensions/codemap-extension`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.codemap = false;
  }

  try {
    await access(`/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.frontend = false;
  }

  try {
    await access(`/home/${options.account}/.vscode/extensions`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.extDir = false;
  }

  

  let currentFileUrl = import.meta.url;
  let scriptsPath = '/'+path.join(
    decodeURI(new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1)),
    '../../scripts'
  );

  let srcPath = '/'+path.join(
    decodeURI(new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1)),
    '../'
  );

  //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking Dependency Installations',
      enabled: () => !options.runUnInstall,
      task: () => {
        return new Listr([
          {
            title: `Checking ${chalk.inverse('NPM')} Installation`,
            enabled: () => true,
            task: () => commandExists('npm').then(()=>{depInstall.npm=true;}).catch(()=>{
              console.error(`${chalk.inverse(`${chalk.blue.bold('npm')} command not found${'\n'.repeat(2)} Please install ${chalk.blue.bold('NodeJS')} version ${chalk.yellow.bold('>=10')} ${'\n'.repeat(2)} Then Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up`)}`)
              process.exit(1);
            })
          },
          {
            title: `Checking ${chalk.inverse('NodeJS')} Installation`,
            enabled: () => true,
            task: () => commandExists('node').then(()=>{depInstall.node=true;}).catch(()=>{
              console.error(`${chalk.inverse(`${chalk.blue.bold('node')} command not found${'\n'.repeat(2)} Please install ${chalk.blue.bold('NodeJS')} version ${chalk.yellow.bold('>=10')} ${'\n'.repeat(2)} Then Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up`)}`)
              process.exit(1);
            })
          },
          {
            title: `Checking ${chalk.inverse('NodeJS')} Version`,
            enabled: () => true,
            task: () => {
              const version = process.version;
              if(parseFloat(version.substr(1,version.length))>=10){
                depInstall.nodeVers = true;
              }else{
                console.error(`${chalk.inverse(`The current version of node ${chalk.blue.bold(version)} is outdated${'\n'.repeat(2)}Please Update node to version ${chalk.yellow.bold('>=10')} ${'\n'.repeat(2)} Then Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up`)}`)
                process.exit(1);
              }
            }
          },
          {
            title: `Checking ${chalk.inverse('VSCode')} Installation`,
            enabled: () => true,
            task: () => commandExists('code').then(()=>{depInstall.vscode=true;}).catch(()=>{})
          },
          {
            title: `Checking ${chalk.inverse('Git')} Installation`,
            enabled: () => true,
            task: () => commandExists('git').then(()=>{depInstall.git=true;}).catch(()=>{})
          },
          {
            title: `Checking ${chalk.inverse('SVF')} Installation`,
            enabled: () => true,
            task: () => {
              if(dirPresence.llvmclang && dirPresence.svfR){
                depInstall.svf = true;
              }
            }
            //commandExists('wpa').then(()=>{depInstall.svf=true;}).catch(()=>{})
          }
        ], {concurrent: false});
      }      
    },
    {
      title: 'Installing Dependencies',
      enabled: () => options.runInstall,
      skip: () => {
        if(depInstall.vscode===true&&depInstall.npm===true&&depInstall.node===true&&depInstall.git===true&&depInstall.nodeVers===true){
          return true;
        }
      },
      task: () => {
        return new Listr([
          {
            title: `Installing ${chalk.inverse('VSCode')}`,
            enabled: () => true,
            skip: () => depInstall.vscode,
            task: () => {
              return new Listr([
                {
                  title: `Installing ${chalk.blue('Dependencies')}`,
                  enabled: () => true,
                  task: () => installVSCodeDependencies().then(()=>{}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('Dependencies')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis --install')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                },
                {
                  title: `Downloading ${chalk.blue('VSCode Install File')}`,
                  enabled: () => true,
                  task: () => execao('wget', ['https://az764295.vo.msecnd.net/stable/5763d909d5f12fe19f215cbfdd29a91c0fa9208a/code_1.45.1-1589445302_amd64.deb'])
                },
                {
                  title: `Installing ${chalk.yellow('VSCode')}`,
                  enabled: () => true,
                  task: () => installVSCode().then(()=>{depInstall.vscode=true}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('VSCode')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis --install')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                },
                {
                  title: `Removing ${chalk.yellow('VSCode Install File')}`,
                  enabled: () => true,
                  task: () => removeInstallFiles().then(()=>{}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong removing ${chalk.red.bold('VSCode INstall File')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis --install')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                }
              ],{concurrent: false})
            }
          },
          {
            title: `Installing ${chalk.inverse('Git')}`,
            enabled: () => true,
            skip: () => depInstall.git,
            task: () => installDependencies('git').then(()=>{depInstall.git = true}).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('Git')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis --install')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
              process.exit(1);
            })
          },
          {
            title: `Installing ${chalk.inverse('Unzip')}`,
            enabled: () => true,
            //skip: () => depInstall.git,
            task: () => execao('sudo', ['apt', 'install', '-y', 'unzip'])
          }
        ], {concurrent: false});
      }      
    },
    {
      title: `Installing ${chalk.inverse('WebSVF frontend-server')}`,
      enabled: () => (!dirPresence.frontendServer && options.runInstall),
      //skip: () => !options.runInstall,
      task: () => {
        return new Listr([
          {
            title: `Downloading ${chalk.inverse('WebSVF-frontend-server')}`,
            enabled: () => true,
            skip: () => !options.runInstall,
            task: () => execao('wget', ['-c','https://github.com/SVF-tools/WebSVF/releases/download/0.1.0/bug_analyis_front-end-0.0.9.tgz'])
          },
          {
            title: `Making directory ${chalk.blue('.bug-report')}`,
            enabled: () => true,
            //skip: () => !options.runInstall,
            task: () => execao('mkdir', ['-m', 'a=rwx', '.bug-report'],{
              cwd: `/home/${options.account}`
            })
          },
          {
            title: `Unpacking ${chalk.inverse.blue('WebSVF-frontend-server')} files`,
            enabled: () => true,
            skip: () => !dirPresence.homeW,
            task: () => execao('mv', ['-f',`bug_analyis_front-end-0.0.9.tgz`,`/home/${options.account}/.bug-report/bug_analyis_front-end-0.0.9.tgz`], null, (result)=>{
              execao('tar', ['-xzvf','bug_analyis_front-end-0.0.9.tgz'], {
                cwd: `/home/${options.account}/.bug-report/`
              }, (result) => {
                execao('find', ['package', '-maxdepth', '1', '-mindepth', '1', '-exec', 'mv', '{}', '.', '\;'], {
                  cwd: `/home/${options.account}/.bug-report/`
                })
              })
            })
          },
          {
            title: `Installing ${chalk.inverse.blue('WebSVF-frontend-server')}`,
            enabled: () => true,
            skip: () => !dirPresence.homeW,
            task: () => projectInstall({
              cwd: `/home/${options.account}/.bug-report/`,
            }),
          },
          {
            title: `Allowing ${chalk.blue('access')}`,
            enabled: () => true,
            skip: () => !options.runInstall,
            task: () => execao('chmod', ['-R','u=rwx,g=rwx,o=rwx',`/home/${options.account}/.bug-report/`])
          },
          {
            title: `Removing ${chalk.blue('Installation files')}`,
            enabled: () => true,
            skip: () => !options.runInstall,
            task: () => {
              execao('rm', ['-rf','bug_analyis_front-end-0.0.9.tgz'], {
                cwd: `/home/${options.account}/.bug-report/`
              });
              // execao('rm', ['-rf','package/'],{
              //   cwd: `/home/${options.account}/.bug-report`
              // });
          }
          },
        ],{concurrent: false})
      }
    },
    {
      title: `Installing ${chalk.inverse('WebSVF Extensions')}`,
      enabled: () => (depInstall.vscode && !dirPresence.frontend && options.runInstall),
      //skip: () => !options.runInstall,
      task: () => {
        return new Listr([
          {
            title: `Downloading ${chalk.inverse('WebSVF-frontend-extension')}`,
            enabled: () => depInstall.vscode && !dirPresence.frontend,
            skip: () => !options.runInstall,
            task: () => execao('wget', ['-c','https://github.com/SVF-tools/WebSVF/releases/download/0.9.0/WebSVF-frontend-extension_0.9.0.vsix'])
          },
          {
            title: `Downloading ${chalk.inverse('WebSVF-codemap-extension')}`,
            enabled: () => depInstall.vscode && !dirPresence.codemap,
            skip: () => !options.runInstall,
            task: () => execao('wget', ['-c', 'https://github.com/SVF-tools/WebSVF/releases/download/0.0.1/codemap-extension-0.0.1.vsix'])
          },
          {
            title: `Making directory ${chalk.blue('VSCode Extensions')}`,
            enabled: () => !dirPresence.extDir,
            //skip: () => !options.runInstall,
            task: () => execao('mkdir', ['-m', 'a=rwx', '.vscode'],{
              cwd: `/home/${options.account}`
            })
          },
          {
            title: `Making directory ${chalk.blue('VSCode Extensions')}`,
            enabled: () => !dirPresence.extDir,
            //skip: () => !options.runInstall,
            task: () => execao('mkdir', ['-m', 'a=rwx', '-p', 'extensions'],{
              cwd: `/home/${options.account}/.vscode`
            })
          },
          {
            title: `Moving ${chalk.blue('WebSVF-frontend-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend),
            //skip: () => !options.runInstall,
            task: () => execao('mv', ['-f','WebSVF-frontend-extension_0.9.0.vsix', `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0.zip`])
          },
          {
            title: `Moving ${chalk.blue('WebSVF-codemap-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => execao('mv', ['-f','codemap-extension-0.0.1.vsix',`/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1.zip`])
          },
          {
            title: `Making directory ${chalk.blue('WebSVF-codemap-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => execao('mkdir', ['-m', 'a=rwx','codemap-extension-0.0.1'],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
          {
            title: `Making directory ${chalk.blue('WebSVF-frontend-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend),
            skip: () => !options.runInstall,
            task: () => execao('mkdir', ['-m', 'a=rwx','WebSVF-frontend-extension_0.9.0'],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
          {
            title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => execao('unzip', ['codemap-extension-0.0.1.zip', '-d', `/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1`],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
          {
            title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend),
            skip: () => !options.runInstall,
            task: () => execao('unzip', ['WebSVF-frontend-extension_0.9.0.zip', '-d', `/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0`],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
          {
            title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => execao('mv', ['-f',`/home/${options.account}/.vscode/extensions/codemap-extension-0.0.1/extension/`,`/home/${options.account}/.vscode/extensions/codemap-extension/`])
          },
          {
            title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend),
            skip: () => !options.runInstall,
            task: () => execao('mv', ['-f',`/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension_0.9.0/extension/`,`/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension/`])
          },
          {
            title: `Allowing ${chalk.blue('access to extensions')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => {
              execao('chmod', ['-R','u=rwx,g=rwx,o=rwx',`/home/${options.account}/.vscode/extensions/WebSVF-frontend-extension/`]);
              execao('chmod', ['-R','u=rwx,g=rwx,o=rwx',`/home/${options.account}/.vscode/extensions/codemap-extension/`]);
            }
          },
          {
            title: `Removing ${chalk.blue('Extension files')}`,
            enabled: () => (depInstall.vscode && !dirPresence.frontend && !dirPresence.codemap),
            skip: () => !options.runInstall,
            task: () => execao('rm', ['-rf','WebSVF-frontend-extension_0.9.0.zip','codemap-extension-0.0.1.zip'],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
        ],{concurrent: false})
      }
    },
    {
      title: `Installing ${chalk.inverse('SVF')}`,
      enabled: () => options.runInstall,
      skip: () => depInstall.svf,
      task: () => {
        return new Listr([
          {
            title: `Installing ${chalk.inverse(chalk.blue('SVF Dependencies'))}`,
            enabled: () => true,
            task: () => {
              return new Listr([
                {
                  title: `Updating ${chalk.blue('Ubuntu Packages')}`,
                  enabled: () => true,
                  task: () => updatePackages().then(()=>{}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong updating ${chalk.red.bold('Ubuntu Packages')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                },
                {
                  title: `Installing ${chalk.blue('Essential Tools')}`,
                  enabled: () => true,
                  task: () => installSVFEssentialTools().then(()=>{}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong instaling ${chalk.red.bold('Essential Tools for SVF Installation')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                },
                {
                  title: `Installing ${chalk.blue('WLLVM and pygraphviz')}`,
                  enabled: () => true,
                  task: () => installSVFDependencies().then(()=>{}).catch((e)=>{
                    console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('WLLVM and pygraphviz')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
                    console.error(e);
                    process.exit(1);
                  })
                },
                
              ],{concurrent: false})
            }
          },
          {
            title: `Creating ${chalk.inverse.blue('SVF-Tools')} directory`,
            enabled: () => !dirPresence.svfToolsR,
            skip: () => !dirPresence.homeW,
            task: () => createSVFToolsDirectory(options.account).then(()=>{}).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong creating ${chalk.red.bold('SVF-Tools')} directory${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
              process.exit(1);
            })
          },
          {
            title: `Downloading ${chalk.inverse.blue('LLVM-Clang 10.0')} binary`,
            enabled: () => (!dirPresence.llvmclangUnpack && !dirPresence.llvmclang),
            skip: () => !dirPresence.homeW,
            task: () => execao('wget', ['-c', 'https://github.com/llvm/llvm-project/releases/download/llvmorg-10.0.0/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz'],{
                cwd: `/home/${options.account}/SVFTools/`
              })
          },
          {
            title: `Downloading ${chalk.inverse.blue('SVF')} binary`,
            enabled: () => !dirPresence.svfR,
            skip: () => !dirPresence.homeW,
            task: () => execao('wget', ['-c', 'https://github.com/codemapweb/SVF/releases/download/1.0/SVF.tar.xz'],{
                cwd: `/home/${options.account}/SVFTools/`
              })
          },
          {
            title: `Unpacking ${chalk.inverse.blue('LLVM-Clang 10.0')} binary`,
            enabled: () => (!dirPresence.llvmclangUnpack && !dirPresence.llvmclang),
            skip: () => !dirPresence.homeW,
            task: () => execao('tar', ['-xvf','clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz', '-C', `/home/${options.account}/SVFTools/`],{
                cwd: `/home/${options.account}/SVFTools/`
              },(result)=>{dirPresence.llvmclangUnpack = true})
          },
          {
            title: `Renaming ${chalk.inverse.blue('LLVM-Clang')} directory`,
            enabled: () => (!dirPresence.llvmclang && dirPresence.llvmclangUnpack),
            skip: () => !dirPresence.homeW,
            task: () => execao('mv', [`/home/${options.account}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`,`/home/${options.account}/SVFTools/clang-llvm`],{
              cwd: `/home/${options.account}/SVFTools/`,
            },(result)=>{dirPresence.llvmclang = true})
          },
          {
            title: `Unpacking ${chalk.inverse.blue('SVF')} binary`,
            enabled: () => !dirPresence.svfR,
            skip: () => !dirPresence.homeW,
            task: () => execao('tar', ['-xvf','SVF.tar.xz', '-C', `/home/${options.account}/SVFTools/`],{
                cwd: `/home/${options.account}/SVFTools/`
            },(result)=>{dirPresence.svfR = true})
          },
          {
            title: `Setting PATHs for ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
            enabled: () => true,
            task: () => execao('cp', ['-f', 'setupSVF.sh', `/home/${options.account}/SVFTools/`],{
                cwd: scriptsPath,
              }, (result)=>{
                fs.readFile(`/home/${options.account}/SVFTools/setupSVF.sh`, (err, data) => {
                  if (err) {
                      throw err;
                  }
                  const dataSplit = data.toString().replace('#########', `########\nINSTALL_DIR="/home/${options.account}/SVFTools"`).replace(/\r\n/gm, "\n");

                  fs.writeFile(`/home/${options.account}/SVFTools/setupSVF.sh`, `${dataSplit}`, (err) => {
                    if (err) throw err;

                    execao('sh', ['setupSVF.sh'],{
                      cwd: `/home/${options.account}/SVFTools/`,
                    }, (result)=>{
                      console.error(`${chalk.inverse.green('SUCCESS')}: Please RESTART your system to finish Installation`);
                      execao('rm', ['-rf','clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz', `SVF.tar.xz`, 'setupSVF.sh' ],{
                        cwd: `/home/${options.account}/SVFTools/`
                      })
                    })
                });
                });
              })
          }
        ], {concurrent: false})
      }
    },
    {
      title: `Uninstalling ${chalk.inverse('WebSVF')}`,
      enabled: () => options.runUnInstall,
      skip: () => !depInstall.svf,
      task: () => {
        return new Listr([
          {
            title: `Removing ${chalk.blue('Extension files')}`,
            enabled: () => true,
            //skip: () => !options.runInstall,
            task: () => execao('rm', ['-rf','WebSVF-frontend-extension','codemap-extension', 'codemap-extension-0.0.1/', 'WebSVF-frontend-extension_0.9.0/'],{
              cwd: `/home/${options.account}/.vscode/extensions`
            })
          },
          {
            title: `Removing ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
            enabled: () => true,
            task: () => execao('cp', ['-f', 'removeSVF.sh', `/home/${options.account}/SVFTools/`],{
                cwd: scriptsPath,
              }, (result)=>{
                fs.readFile(`/home/${options.account}/SVFTools/removeSVF.sh`, (err, data) => {
                  if (err) {
                      throw err;
                  }
                  const dataSplit = data.toString().replace('#########', `########\nINSTALL_DIR="/home/${options.account}/SVFTools"`).replace(/\r\n/gm, "\n");

                  fs.writeFile(`/home/${options.account}/SVFTools/removeSVF.sh`, `${dataSplit}`, (err) => {
                    if (err) throw err;

                    execao('sh', ['removeSVF.sh'],{
                      cwd: `/home/${options.account}/SVFTools/`,
                    }, (result)=>{
                      console.error(`${chalk.inverse.green('SUCCESS')}: Please RESTART your system to finish Installation`);
                      execao('rm', ['-rf','SVFTools', '.bug-report'],{
                        cwd: `/home/${options.account}`
                      });
                    })
                });
              });
            })
          }
        ], {concurrent: false})
      }
    },
    {
      title: `Generating ${chalk.yellow.bold('Bug-Report-Analysis.json')}`,
      enabled: () => (!options.runInstall && !options.runUnInstall),
      //skip: () => depInstall.svf,
      task: () => generateJSON(srcPath, options.generateJSONDir).then(()=>depInstall.svf = true).catch((e)=>{
        console.error(`${chalk.inverse(`Something went wrong generating ${chalk.red.bold('Bug-Report-Analysis.json')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
        console.error(e);
      })
    }
  ]);

  //Run the list of tasks defined above
  try{
    await tasks.run();
  }catch(e){
    console.error(e);
  }

  //console.log(depInstall);
  //console.log(dirPresence);

  return true;
}