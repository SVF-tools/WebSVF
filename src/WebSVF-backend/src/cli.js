import arg from 'arg';
import inquirer from 'inquirer';
import { createAnalysis } from './main';
import execa from 'execa';
import getos from 'getos';
import Listr from 'listr';
import chalk from 'chalk';


function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '--generateJSON': String,
      '--user': String,
      '-g': '--generateJSON',
      '-u': '--user',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    template: args._[0],
    user: args['--user'] || '',
    generateJSON: args['--generateJSON'] || process.cwd(),
    output: args['--output'] || '',
    runInstall: args['--install'] || false,
  };
}

async function runListr(){
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
    }
  ])

  //Run the list of tasks defined above
  try{
    await tasks.run();
  }catch(e){
    console.error(e);
  }
}

async function promptForMissingOptions(options) {

  const mapExclude = new Map([
    ['root', 'user'], ['daemon', 'user'], ['bin', 'user'], ['sys', 'user'], ['sync', 'user'], ['games', 'user'], ['man', 'user'], ['lp', 'user'], ['mail', 'user'], ['news', 'user'], ['uucp', 'user'], ['proxy', 'user'], ['www-data', 'user'], ['backup', 'user'], ['list', 'user'], ['irc', 'user'], ['gnats', 'user'], ['nobody', 'user'], ['systemd-network', 'user'], ['systemd-resolve', 'user'], ['systemd-timesync', 'user'], ['messagebus', 'user'], ['syslog', 'user'], ['_apt', 'user'], ['tss', 'user'], ['uuidd', 'user'], ['tcpdump', 'user'], ['avahi-autoipd', 'user'], ['usbmux', 'user'], ['rtkit', 'user'], ['dnsmasq', 'user'], ['cups-pk-helper', 'user'], ['speech-dispatcher', 'user'], ['avahi', 'user'], ['kernoops', 'user'], ['saned', 'user'], ['nm-openvpn', 'user'], ['hplip', 'user'], ['whoopsie', 'user'], ['colord', 'user'], ['geoclue', 'user'], ['pulse', 'user'], ['gnome-initial-setup', 'user'], ['gdm', 'user'], ['systemd-coredump', 'user'], ['vboxadd', 'user']
   ]);

  const result = await execa('cut', ['-d:','-f1', '/etc/passwd']);       

  const mapT = result.stdout.split('\n').filter((item)=>(!mapExclude.has(item)));

  const defaultTemplate = mapT[0];

  //console.log(defaultTemplate);



  // if (options.skipPrompts) {
  //   return {
  //     ...options,
  //     template: options.template || defaultTemplate,
  //   };
  // }
 
  const questions = [];
  if (!options.user&&options.runInstall) {
    questions.push({
      type: 'list',
      name: 'user',
      message: 'Please choose which user to install WebSVF for:',
      choices: mapT,
      default: defaultTemplate,
    });
  }
  else if(mapT.indexOf(`${options.user}`)===-1&&options.runInstall){
    console.log(`${options.user}`);
    questions.push({
      type: 'list',
      name: 'user',
      message: 'User does not Exist, Please select one of the users:',
      choices: mapT,
      default: defaultTemplate,
    });
  }
 
  // if (!options.git) {
  //   questions.push({
  //     type: 'confirm',
  //     name: 'git',
  //     message: 'Initialize a git repository?',
  //     default: false,
  //   });
  // }
 
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    user: options.user || answers.user,
    //template: options.template || answers.template,

    //git: options.git || answers.git,
  };

  return {
    ...options
  };
}

export async function cli(args) {

    let options = parseArgumentsIntoOptions(args);

    await runListr();

    options = await promptForMissingOptions(options);

    await createAnalysis(options);

    //console.log(options);
}