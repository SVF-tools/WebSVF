import getos from 'getos';
import chalk from 'chalk';
import Listr from 'listr';
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

//Checks the System's OS to determine if the system can run WebSVF
async function checkOS() {
  let osInfo = getos((e,os) => {
      if(e) return console.log(e)
      return os;
  });

  if(!osInfo.os){
    console.error(`%s ${osInfo}`, chalk.red.bold('ERROR'));
    process.exit(1);
  }

  osInfo = {
    ...osInfo,
    os: 'linux',
    dist: 'Ubuntu',
    release: '20.04'
  };

  if(osInfo.os!=='linux'){
    console.error(`%s Sorry WebSVF is not compatible with %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.blue.bold(`${osInfo.os}`), chalk.black.bgWhite('-- Please check back later --'));
    process.exit(1);
  }
  else if(osInfo.dist!=='Ubuntu'){
    console.error(`%s Sorry WebSVF is not compatible with the %s distribution of %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.cyan.bold(`${osInfo.dist}`), chalk.blue.bold(`${osInfo.os}`), chalk.black.bgWhite('-- Please check back later --'));
    process.exit(1);
  }
  else if(!osInfo.release){
    console.error(`%s %s release version could not be verified${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.cyan.bold(`${osInfo.dist}`), chalk.black.bgWhite('-- Please check back later --'));
    process.exit(1);
  }
  else if(!osInfo.release.includes('18.04')&&!osInfo.release.includes('20.04')){
    console.error(`%s Sorry WebSVF is not compatible with version %s of %s${'\n'.repeat(2)}%s`, chalk.red.bold('ERROR'), chalk.yellow(`${osInfo.release}`), chalk.cyan.bold(`${osInfo.dist}`), chalk.black.bgWhite('-- Please check back later --'));
    process.exit(1);
  }
  
  //console.log(osInfo);
  return true;
}

export async function createAnalysis(options) {

  //A JavaScript object containing boolean values representing whether a particular depndency is installed or not
  const depInstall = {
    vscode: false,
    node: false,
    npm: false,
    git: false
  }

   //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      enabled: () => true,
      task: () => checkOS()
    },
    {
      title: 'Checking Dependency Installations',
      enabled: () => true,
      task: () => {
        return new Listr([
          {
            title: `Checking ${chalk.inverse('NPM')} Installation`,
            enabled: () => true,
            task: () => commandExists('npm').then(()=>{depInstall.npm=true;})
          },
          {
            title: `Checking ${chalk.inverse('NodeJS')} Installation`,
            enabled: () => true,
            task: () => commandExists('node').then(()=>{depInstall.node=true;})
          },
          {
            title: `Checking ${chalk.inverse('VSCode')} Installation`,
            enabled: () => true,
            task: () => commandExists('code').then(()=>{depInstall.vscode=true;})
          },
          {
            title: `Checking ${chalk.inverse('Git')} Installation`,
            enabled: () => true,
            task: () => commandExists('git').then(()=>{depInstall.git=true;})
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
            title: `Install ${chalk.inverse('NPM')}`,
            enabled: () => true,
            skip: () => depInstall.npm,
            task: () => installDependencies('npm')
          },
          {
            title: `Install ${chalk.inverse('NodeJS')}`,
            enabled: () => true,
            skip: () => depInstall.node,
            task: () => installDependencies('node')
          },
          {
            title: `Install ${chalk.inverse('VSCode')}`,
            enabled: () => true,
            skip: () => depInstall.vscode,
            task: () => installDependencies('code')
          },
          {
            title: `Checking ${chalk.inverse('Git')} Installation`,
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