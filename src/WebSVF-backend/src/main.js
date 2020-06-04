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

async function removeOldSVF(user) {
  const result = await execa('rm', ['-rf', 'SVF'],{
    cwd: `/home/${user}/SVFTools/`,
  });

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
  const result = await execa('node', ['generateJSON.js', projectDir],{
    cwd: path,
  });

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
    frontend: true
  }
  

  try {
    await access(`/home/${options.user}/SVFTools`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.svfToolsR = false;
  }

  try {
    await access(`/home/${options.user}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.llvmclangUnpack = false;
  }

  try {
    await access(`/home/${options.user}/SVFTools/clang-llvm`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.llvmclang = false;
  }

  try {
    await access(`/home/${options.user}`, fs.constants.W_OK);
  } catch (err) {
    dirPresence.homeW = false;
  }

  try {
    await access(`/home/${options.user}/.vscode/extensions/codemap-extension`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.codemap = false;
  }

  try {
    await access(`/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension`, fs.constants.R_OK);
  } catch (err) {
    dirPresence.frontend = false;
  }

  

  let currentFileUrl = import.meta.url;
  let templateDir = '/'+path.join(
    decodeURI(new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1)),
    '../../scripts'
  );

  //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      enabled: () => true,
      task: () => getos((e,os) => {
        if(e) return console.error(e)

        if(!os.os){
          console.error(`%s ${os}`, chalk.red.bold('ERROR'));
          process.exit(1);
        }
      
        if(os.os!=='linux'){
          console.error(`%s Sorry WebSVF is not compatible with %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.blue.bold(`${os.os}`), chalk.black.bgWhite('-- Please check back later --'));
          process.exit(1);
        }
        else if(os.dist!=='Ubuntu'){
          console.error(`%s Sorry WebSVF is not compatible with the %s distribution of %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.cyan.bold(`${os.dist}`), chalk.blue.bold(`${os.os}`), chalk.black.bgWhite('-- Please check back later --'));
          process.exit(1);
        }
        else if(!os.release){
          console.error(`%s %s release version could not be verified${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.cyan.bold(`${os.dist}`), chalk.black.bgWhite('-- Please check back later --'));
          process.exit(1);
        }
        else if(!os.release.includes('20.04')){
          console.error(`%s Sorry WebSVF is not compatible with version %s of %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.yellow(`${os.release}`), chalk.cyan.bold(`${os.dist}`), chalk.black.bgWhite('-- Please check back later --'));
          process.exit(1);
        }
        
        return true;
    })
    },
    {
      title: 'Checking Dependency Installations',
      enabled: () => true,
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
            task: () => commandExists('wpa -ander').then(()=>{depInstall.svf=true;}).catch(()=>{})
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
            title: `Installing ${chalk.inverse('Git')}`,
            enabled: () => true,
            //skip: () => depInstall.git,
            task: () => execao('sudo', ['apt', 'install', '-y', 'unzip'])
          }
        ], {concurrent: false});
      }      
    },
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
      title: `Copying ${chalk.blue('WebSVF-frontend-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend,
      skip: () => !options.runInstall,
      task: () => execao('mv', ['-f','WebSVF-frontend-extension_0.9.0.vsix', `/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension_0.9.0.zip`])
    },
    {
      title: `Copying ${chalk.blue('WebSVF-codemap-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => execao('mv', ['-f','codemap-extension-0.0.1.vsix',`/home/${options.user}/.vscode/extensions/codemap-extension-0.0.1.zip`])
    },
    {
      title: `Making directory ${chalk.blue('WebSVF-codemap-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => execao('mkdir', ['-m', 'a=rwx','codemap-extension-0.0.1'],{
        cwd: `/home/${options.user}/.vscode/extensions`
      })
    },
    {
      title: `Making directory ${chalk.blue('WebSVF-frontend-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend,
      skip: () => !options.runInstall,
      task: () => execao('mkdir', ['-m', 'a=rwx','WebSVF-frontend-extension_0.9.0'],{
        cwd: `/home/${options.user}/.vscode/extensions`
      })
    },
    {
      title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => execao('unzip', ['codemap-extension-0.0.1.zip', '-d', `/home/${options.user}/.vscode/extensions/codemap-extension-0.0.1`],{
        cwd: `/home/${options.user}/.vscode/extensions`
      })
    },
    {
      title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend,
      skip: () => !options.runInstall,
      task: () => execao('unzip', ['WebSVF-frontend-extension_0.9.0.zip', '-d', `/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension_0.9.0`],{
        cwd: `/home/${options.user}/.vscode/extensions`
      })
    },
    {
      title: `Extracting ${chalk.blue('WebSVF-codemap-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => execao('mv', ['-f',`/home/${options.user}/.vscode/extensions/codemap-extension-0.0.1/extension/`,`/home/${options.user}/.vscode/extensions/codemap-extension/`])
    },
    {
      title: `Extracting ${chalk.blue('WebSVF-frontend-extension')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend,
      skip: () => !options.runInstall,
      task: () => execao('mv', ['-f',`/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension_0.9.0/extension/`,`/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension/`])
    },
    {
      title: `Allowing ${chalk.blue('access to extensions')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => {
        //execao('chmod', ['u=rwx,g=rwx,o=rwx',`/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension_0.9.0.zip`]);
        //execao('chmod', ['u=rwx,g=rwx,o=rwx',`/home/${options.user}/.vscode/extensions/codemap-extension-0.0.1.zip`])
        execao('chmod', ['-R','u=rwx,g=rwx,o=rwx',`/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension/`]);
        execao('chmod', ['-R','u=rwx,g=rwx,o=rwx',`/home/${options.user}/.vscode/extensions/codemap-extension/`]);
      }
    },
    // {
    //   title: `Allowing ${chalk.blue('access to extensions')}`,
    //   enabled: () => depInstall.vscode,
    //   skip: () => !options.runInstall,
    //   task: () => {
    //     execao('sudo', ['chmod','-R','u=rwx,g=rwx,o=rwx','*'],{
    //       cwd: `/home/${options.user}/.vscode/extensions/WebSVF-frontend-extension/`
    //     });
    //     execao('sudo', ['chmod','-R','u=rwx,g=rwx,o=rwx','*'],{
    //       cwd: `/home/${options.user}/.vscode/extensions/codemap-extension/`
    //     });
    //   }
    // },
    {
      title: `Removing ${chalk.blue('Extension files')}`,
      enabled: () => depInstall.vscode && !dirPresence.frontend && !dirPresence.codemap,
      skip: () => !options.runInstall,
      task: () => execao('rm', ['-rf','WebSVF-frontend-extension_0.9.0.zip','codemap-extension-0.0.1.zip', 'codemap-extension-0.0.1/', 'WebSVF-frontend-extension_0.9.0/'],{
        cwd: `/home/${options.user}/.vscode/extensions`
      })
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
            title: `Deleting ${chalk.inverse.blue('Old SVF Files')}`,
            enabled: () => false && dirPresence.svfR,
            skip: () => !dirPresence.homeW,
            task: () => removeOldSVF(options.user).then(()=>{}).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong removing ${chalk.red.bold('Old SVF Files')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
              process.exit(1);
            })
          },
          {
            title: `Creating ${chalk.inverse.blue('SVF-Tools')} directory`,
            enabled: () => !dirPresence.svfToolsR,
            skip: () => !dirPresence.homeW,
            task: () => createSVFToolsDirectory(options.user).then(()=>{}).catch((e)=>{
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
                cwd: `/home/${options.user}/SVFTools/`
              })
          },
          {
            title: `Downloading ${chalk.inverse.blue('SVF')} binary`,
            enabled: () => !dirPresence.svfR,
            skip: () => !dirPresence.homeW,
            task: () => execao('wget', ['-c', 'https://github.com/codemapweb/SVF/releases/download/1.0/SVF.tar.xz'],{
                cwd: `/home/${options.user}/SVFTools/`
              })
          },
          {
            title: `Unpacking ${chalk.inverse.blue('LLVM-Clang 10.0')} binary`,
            enabled: () => (!dirPresence.llvmclangUnpack && !dirPresence.llvmclang),
            skip: () => !dirPresence.homeW,
            task: () => execao('tar', ['-xvf','clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz', '-C', `/home/${options.user}/SVFTools/`],{
                cwd: `/home/${options.user}/SVFTools/`
              },(result)=>{dirPresence.llvmclangUnpack = true})
          },
          {
            title: `Renaming ${chalk.inverse.blue('LLVM-Clang')} directory`,
            enabled: () => (!dirPresence.llvmclang && dirPresence.llvmclangUnpack),
            skip: () => !dirPresence.homeW,
            task: () => execao('mv', [`/home/${options.user}/SVFTools/clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04`,`/home/${options.user}/SVFTools/clang-llvm`],{
              cwd: `/home/${options.user}/SVFTools/`,
            },(result)=>{dirPresence.llvmclang = true})
          },
          {
            title: `Unpacking ${chalk.inverse.blue('SVF')} binary`,
            enabled: () => !dirPresence.svfR,
            skip: () => !dirPresence.homeW,
            task: () => execao('tar', ['-xvf','SVF.tar.xz', '-C', `/home/${options.user}/SVFTools/`],{
                cwd: `/home/${options.user}/SVFTools/`
            },(result)=>{dirPresence.svfR = true})
          },
          {
            title: `Setting PATHs for ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
            enabled: () => true,
            task: () => execao('cp', ['-f', 'setupSVF.sh', `/home/${options.user}/SVFTools/`],{
                cwd: templateDir,
              }, (result)=>{
                fs.readFile(`/home/${options.user}/SVFTools/setupSVF.sh`, (err, data) => {
                  if (err) {
                      throw err;
                  }
                  const dataSplit = data.toString().replace('#########', `########\nINSTALL_DIR="/home/${options.user}/SVFTools"`).replace(/\r\n/gm, "\n");

                  fs.writeFile(`/home/${options.user}/SVFTools/setupSVF.sh`, `${dataSplit}`, (err) => {
                    if (err) throw err;

                    execao('sh', ['setupSVF.sh'],{
                      cwd: `/home/${options.user}/SVFTools/`,
                    }, (result)=>{
                      console.error(`${chalk.inverse.green('SUCCESS')}: Please RESTART your system to finish Installation`);
                      process.exit(1);
                    })
                });
                });
              })
          },
          {
            title: `Setting PATHs for ${chalk.inverse.blue('LLVM, Clang & SVF')}`,
            enabled: () => false,
            task: () => {}
          },
          {

            title: `${chalk.inverse.blue('Cleaning Up')}`,
            enabled: () => (dirPresence.svfR && dirPresence.llvmclang),
            skip: () => !dirPresence.homeW,
            task: () => execao('rm', ['-rf','clang+llvm-10.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz', `SVF.tar.xz` ],{//, 'setupSVF.sh'
                cwd: `/home/${options.user}/SVFTools/`
              })
          }
        ], {concurrent: false})
      }
    },
    {
      title: `Generating ${chalk.yellow.bold('Bug-Report-Analysis.json')}`,
      enabled: () => options.generateJSON!=='',
      //skip: () => depInstall.svf,
      task: () => generateJSON(templateDir, options.generateJSON).then(()=>depInstall.svf = true).catch((e)=>{
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