import arg from 'arg';
import inquirer from 'inquirer';
import { createAnalysis } from './main';
import execa from 'execa';


function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '--out': String,
      '--generateJSON': String,
      '--user': String,
      '-g': '--generateJSON',
      '-u': '--user',
      '-o': '--out',
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
    generateJSON: args['--generateJSON'] || '',
    output: args['--output'] || '',
    runInstall: args['--install'] || false,
  };
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
  if (!options.user) {
    questions.push({
      type: 'list',
      name: 'user',
      message: 'Please choose which user to install WebSVF for:',
      choices: mapT,
      default: defaultTemplate,
    });
  }
  else if(mapT.indexOf(`${options.user}`)===-1){
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

    options = await promptForMissingOptions(options);

    await createAnalysis(options);

    //console.log(options);
}