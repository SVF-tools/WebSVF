import getos from 'getos';
import chalk from 'chalk';
import Listr from 'listr';


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

   //Define the list of tasks to run using the listr node module
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      task: () => checkOS(),
      enabled: () => true
    }
  ]);

  //Run the list of tasks defined above
  await tasks.run();

  

  return true;
}