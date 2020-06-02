import getos from 'getos';
import chalk from 'chalk';
import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import commandExists from 'command-exists';

async function installDependencies(dependency) {
  if(dependency==='code'){
    const result = await execa('sudo', ['snap','install', dependency, '--classic']);
  }
  else{
    const result = await execa('sudo', ['apt','install','-y', dependency]);
  }
  
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${dependency}`));
  }
  return;
}

async function installSVF(path) {
  //console.log(path);
    const result = await execa('sh', ['setupSVF.sh'],{
      cwd: path,
    });
  //console.log(result.stdout)
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${chalk.yellow.bold('SVF')} ${import.meta.url}`));
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

function updateNodeVersionSync() {
  console.error(`${chalk.inverse(`The current version of node ${chalk.blue.bold(process.version)} is outdated\nAttempting Update, Please Wait...`)}`)
  execa.sync('sudo', ['npm','cache', 'clean', '-f']);
  execa.sync('sudo', ['npm','install', '-g', 'n']);
  execa.sync('sudo', ['n','stable']);
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

  let currentFileUrl = import.meta.url;
  let templateDir = path.resolve(
    decodeURI(new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1)),
    'src'
  );

  //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      enabled: () => true,
      task: () => getos((e,os) => {
        if(e) return console.error(e)

        os = {
          ...os,
          os: 'linux',
          dist: 'Ubuntu',
          release: '18.04' 
        }

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
        else if(!os.release.includes('18.04')&&!os.release.includes('20.04')){
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
            task: () => commandExists('npm').then(()=>{depInstall.npm=true;}).catch(()=>{})
          },
          {
            title: `Checking ${chalk.inverse('NodeJS')} Installation`,
            enabled: () => true,
            task: () => commandExists('node').then(()=>{depInstall.node=true;}).catch(()=>{})
          },
          {
            title: `Checking ${chalk.inverse('NodeJS')} Version`,
            enabled: () => true,
            task: () => {
              const version = process.version;
              if(parseFloat(version.substr(1,version.length))>=10){
                depInstall.nodeVers = true;
              }
            }
          },
          {
            title: `Updating ${chalk.inverse('Node')}`,
            enabled: () => true,
            skip: () => depInstall.nodeVers,
            task: () => {
              updateNodeVersionSync();
              depInstall.nodeVers = true;
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
            task: () => commandExists('wpa').then(()=>{depInstall.svf=true;}).catch(()=>{})
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
            title: `Installing ${chalk.inverse('NPM')}`,
            enabled: () => true,
            skip: () => depInstall.npm,
            task: () => installDependencies('npm').then(()=>depInstall.npm = true).catch((e)=>{
              
              console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('npm')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
            })
          },
          {
            title: `Installing ${chalk.inverse('NodeJS')}`,
            enabled: () => true,
            skip: () => depInstall.node,
            task: () => installDependencies('node').then(()=>depInstall.node = true).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('NodeJS')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
            })
          },
          {
            title: `Installing ${chalk.inverse('VSCode')}`,
            enabled: () => true,
            skip: () => depInstall.vscode,
            task: () => installDependencies('code').then(()=>depInstall.vscode = true).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('VSCode')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
            })
          },
          {
            title: `Installing ${chalk.inverse('Git')}`,
            enabled: () => true,
            skip: () => depInstall.git,
            task: () => installDependencies('git').then(()=>depInstall.git = true).catch((e)=>{
              console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('Git')}${'\n'.repeat(2)} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
              console.error(e);
            })
          }
        ], {concurrent: false});
      }      
    },
    {
      title: 'Installing SVF',
      enabled: () => options.runInstall,
      skip: () => depInstall.svf,
      task: () => installSVF(templateDir).then(()=>depInstall.svf = true).catch((e)=>{
        console.error(`${chalk.inverse(`Something went wrong installing ${chalk.red.bold('SVF')}${'\n'.repeat(2)} ${templateDir} Please Run the command ${chalk.green.italic('sudo create-analysis')} again to finish setting up  ${'\n'.repeat(2)} The Error Log from the failed installation:`)}`);
        console.error(e);
      })
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

  console.log(depInstall);

  return true;
}