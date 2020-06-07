import arg from 'arg';
import inquirer from 'inquirer';
import { createAnalysis } from './main';
import execa from 'execa';
import getos from 'getos';
import Listr from 'listr';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs';
import isElevated from 'is-elevated';

const access = promisify(fs.access);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '--dir': String,
      '--account': String,
      '--uninstall': Boolean,
      '-d': '--dir',
      '-a': '--account',
      '-y': '--yes',
      '-i': '--install',
      '-u': '--uninstall',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    //skipPrompts: args['--yes'] || false,
    template: args._[0],
    arguements: args._,
    account: args['--account'] || '',
    generateJSONDir: args['--dir'] || process.cwd(),
    output: args['--output'] || '',
    runInstall: args['--install'] || false,
    runUnInstall: args['--uninstall'] || false,
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

  const defaultAccount = mapT[0];

  //console.log(defaultAccount);

  const isAdmin = await isElevated();

  const dirPresence = {
    argsDir: true
  }

  if(options.runInstall && !isAdmin){
    console.error(`%s The Installation cannot proceed without elevated privileges (Root access)\nPlease run the command again with elevated privileges (eg. on Linux => ${chalk.green('sudo command')})`, chalk.red.bold('ERROR'));
    process.exit(1);
  }

  if(options.runUnInstall && !isAdmin){
    console.error(`%s The Uninstallation cannot proceed without elevated privileges (Root access)\nPlease run the command again with elevated privileges (eg. on Linux => ${chalk.green('sudo command')})`, chalk.red.bold('ERROR'));
    process.exit(1);
  }

  if(!options.runInstall && !options.runUnInstall && isAdmin){
    console.error(`%s The operation cannot proceed with elevated privileges (Root access)\nPlease run the command again without elevated privileges (eg. on Linux => run the command without the ${chalk.green('sudo')} keyword)`, chalk.red.bold('ERROR'));
    process.exit(1);
  }
  

  try {
    await access(options.generateJSONDir, fs.constants.R_OK);
  } catch (err) {
    dirPresence.argsDir = false;
  }



  // if (options.skipPrompts) {
  //   return {
  //     ...options,
  //     template: options.template || defaultTemplate,
  //   };
  // }
 
  const questions = [];
  if (!options.account && options.runInstall && options.runUnInstall) {
    questions.push({
      type: 'list',
      name: 'account',
      message: 'Please choose which user account to install WebSVF for:',
      choices: mapT,
      default: defaultAccount,
    });
  }
  else if(mapT.indexOf(`${options.account}`)===-1 && options.runInstall && options.runUnInstall){
    console.log(`${options.account}`);
    questions.push({
      type: 'list',
      name: 'account',
      message: 'User does not Exist, Please select one of the user accounts:',
      choices: mapT,
      default: defaultAccount,
    });
  }

 if(options.generateJSONDir && !dirPresence.argsDir && !options.runInstall && !options.runUnInstall){
    questions.push({
      type: 'list',
      name: 'cancel',
      message: 'The specified directory is not reachable, proceed with process directory ?',
      choices: [`${process.cwd()}`,'Quit Operation: Directory does not exist or is not accesible'],
      default: false,
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
    account: options.account || answers.account || defaultAccount,
    cancel: answers.cancel || false,
    //template: options.template || answers.template,

    //git: options.git || answers.git,
  };
}

async function quitOnError(options) {
  if(options.cancel === 'Quit Operation: Directory does not exist or is not accesible'){
    console.error(`%s Sorry the directory ${options.generateJSONDir} does not exist or is not accessible`, chalk.red.bold('ERROR'));
    process.exit(1);
  }
  else if(options.cancel!==false){
    return {
      ...options,
      generateJSONDir: options.cancel
    }
  }
  else {
    return {
      ...options
    }
  }
}

export async function cli(args) {

    let options = parseArgumentsIntoOptions(args);

    await runListr();

    options = await promptForMissingOptions(options);

    options = await quitOnError(options);

    await createAnalysis(options);

    //console.log(options);
}