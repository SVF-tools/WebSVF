import getos from 'getos';
import chalk from 'chalk';
import Listr from 'listr';
import execa from 'execa';
import { exec } from 'child_process';

import checkNodeVersion from 'check-node-version';
import commandExists from 'command-exists';


// async function checkInstall(app){
//   return commandExists(app, (error, cmdExists)=>{
//     if(cmdExists){
//       return;
//     }
//     throw new Error('Test');
//   })
// }

async function installDependencies(dependency) {
  const result = await execa('apt', ['install','-y', dependency]);
  if (result.failed) {
    return Promise.reject(new Error(`Failed to install ${dependency}`));
  }
  return;
}

async function installNpm() {
  exec("sudo apt install -y npm", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
}

async function installNode() {
  exec("sudo apt install -y node", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
}

async function updateNodeVersion() {
  exec("sudo apt install -y npm", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
}

export async function createAnalysis(options) {

  //A JavaScript object containing boolean values representing whether a particular depndency is installed or not
  const depInstall = {
    vscode: false,
    node: false,
    nodeVers: false,
    npm: false,
    git: false
  }

   //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      enabled: () => true,
      task: () => getos((e,os) => {
        if(e) return console.log(e)

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
              console.log(process.version);
            }
            // checkNodeVersion({ node: ">= 10"},(error,result)=> {
            //   if(result.isSatisfied){
            //     depInstall.nodeVers = true;
            //   }
            // })
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
          }
        ], {concurrent: true});
      }      
    },
    {
      title: 'Installing Dependencies',
      enabled: () => true,
      skip: () => {
        if(depInstall.vscode===true&&depInstall.npm===true&&depInstall.node===true&&depInstall.git===true){
          return true;
        }
      },
      task: () => {
        return new Listr([
          
          {
            title: `Installing ${chalk.inverse('NPM')}`,
            enabled: () => true,
            skip: () => depInstall.npm,
            task: () => installNpm()    //installDependencies('npm')
          },
          {
            title: `Installing ${chalk.inverse('NodeJS')}`,
            enabled: () => true,
            skip: () => depInstall.node,
            task: () => installNode()      //installDependencies('node')
          },
          {
            title: `Updating ${chalk.inverse('Node')}`,
            enabled: () => true,
            skip: () => depInstall.nodeVers,
            task: () => updateNodeVersion()
          },
          {
            title: `Installing ${chalk.inverse('VSCode')}`,
            enabled: () => true,
            skip: () => depInstall.vscode,
            task: () => installDependencies('code')
          },
          {
            title: `Installing ${chalk.inverse('Git')} Installation`,
            enabled: () => true,
            skip: () => depInstall.git,
            task: () => installDependencies('git')
          }
        ], {concurrent: true});
      }      
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