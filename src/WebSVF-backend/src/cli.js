import arg from 'arg';
import inquirer from 'inquirer';
import { createAnalysis } from './main';
import execa from 'execa';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs';
import isElevated from 'is-elevated';

import { mapExclude } from './exec/excludedUserNames';
import { checkOS } from './checks/os';

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
    account: args['--account'] || false,
    generateJSONDir: args['--dir'] || process.cwd(),
    output: args['--output'] || '',
    runInstall: args['--install'] || false,
    runUnInstall: args['--uninstall'] || false,
  };
}

async function promptForMissingOptions(options) {
  const result = await execa('cut', ['-d:', '-f1', '/etc/passwd']);

  const mapT = result.stdout
    .split('\n')
    .filter((item) => !mapExclude.has(item));

  const defaultAccount = mapT[0];

  const isAdmin = await isElevated();

  const dirPresence = {
    argsDir: true,
  };

  if (options.runInstall && !isAdmin) {
    console.error(
      `%s The Installation cannot proceed without elevated privileges (Root access)\nPlease run the command again with elevated privileges (eg. on Linux => ${chalk.green(
        'sudo command'
      )})`,
      chalk.red.bold('ERROR')
    );
    process.exit(1);
  }

  if (options.runUnInstall && !isAdmin) {
    console.error(
      `%s The Uninstallation cannot proceed without elevated privileges (Root access)\nPlease run the command again with elevated privileges (eg. on Linux => ${chalk.green(
        'sudo command'
      )})`,
      chalk.red.bold('ERROR')
    );
    process.exit(1);
  }

  if (!options.runInstall && !options.runUnInstall && isAdmin) {
    console.error(
      `%s The operation cannot proceed with elevated privileges (Root access)\nPlease run the command again without elevated privileges (eg. on Linux => run the command without the ${chalk.green(
        'sudo'
      )} keyword)`,
      chalk.red.bold('ERROR')
    );
    process.exit(1);
  }

  try {
    await access(options.generateJSONDir, fs.constants.R_OK);
  } catch (err) {
    dirPresence.argsDir = false;
  }

  const questions = [];
  if (!options.account && options.runInstallm && mapT.length !== 1) {
    questions.push({
      type: 'list',
      name: 'account',
      message: 'Please choose which user account to install WebSVF for:',
      choices: mapT,
      default: defaultAccount,
    });
  } else if (
    mapT.indexOf(`${options.account}`) === -1 &&
    options.runInstall &&
    mapT.length !== 1
  ) {
    //console.log(`${options.account}`);
    questions.push({
      type: 'list',
      name: 'account',
      message: 'User does not Exist, Please select one of the user accounts:',
      choices: mapT,
      default: defaultAccount,
    });
  } else if (!options.account && options.runUnInstall && mapT.length !== 1) {
    questions.push({
      type: 'list',
      name: 'account',
      message: 'Please choose which user account to install WebSVF for:',
      choices: mapT,
      default: defaultAccount,
    });
  } else if (
    mapT.indexOf(`${options.account}`) === -1 &&
    options.runUnInstall &&
    mapT.length !== 1
  ) {
    //console.log(`${options.account}`);
    questions.push({
      type: 'list',
      name: 'account',
      message: 'User does not Exist, Please select one of the user accounts:',
      choices: mapT,
      default: defaultAccount,
    });
  }

  if (
    options.generateJSONDir &&
    !dirPresence.argsDir &&
    !options.runInstall &&
    !options.runUnInstall
  ) {
    questions.push({
      type: 'list',
      name: 'cancel',
      message:
        'The specified directory is not reachable, proceed with process directory ?',
      choices: [
        `${process.cwd()}`,
        'Quit Operation: Directory does not exist or is not accesible',
      ],
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    account: options.account || answers.account || defaultAccount,
    cancel: answers.cancel || false,
  };
}

async function quitOnError(options) {
  if (
    options.cancel ===
    'Quit Operation: Directory does not exist or is not accesible'
  ) {
    console.error(
      `%s Sorry the directory ${options.generateJSONDir} does not exist or is not accessible`,
      chalk.red.bold('ERROR')
    );
    process.exit(1);
  } else if (options.cancel !== false) {
    return {
      ...options,
      generateJSONDir: options.cancel,
    };
  } else {
    return {
      ...options,
    };
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  try {
    options = await checkOS(options);
    if (options.check) {
      options = await promptForMissingOptions(options);

      options = await quitOnError(options);

      await createAnalysis(options);
    }
  } catch (err) {
    console.error(err);
  }

  //console.log(options);
}
