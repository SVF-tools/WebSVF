import arg from 'arg';
import inquirer from 'inquirer';
//import { createProject } from './main';
import { createAnalysis } from './main';


function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '--out': String,
      '--generateJSON': String,
      '-gen': '--generateJSON',
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
    generateJSON: args['--generateJSON'] || '',
    output: args['--output'] || '',
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {
  // const defaultTemplate = 'JavaScript';
  // if (options.skipPrompts) {
  //   return {
  //     ...options,
  //     template: options.template || defaultTemplate,
  //   };
  // }
 
  // const questions = [];
  // if (!options.template) {
  //   questions.push({
  //     type: 'list',
  //     name: 'template',
  //     message: 'Please choose which project template to use',
  //     choices: ['JavaScript', 'TypeScript'],
  //     default: defaultTemplate,
  //   });
  // }
 
  // if (!options.git) {
  //   questions.push({
  //     type: 'confirm',
  //     name: 'git',
  //     message: 'Initialize a git repository?',
  //     default: false,
  //   });
  // }
 
  // const answers = await inquirer.prompt(questions);
  // return {
  //   ...options,
  //   template: options.template || answers.template,
  //   git: options.git || answers.git,
  // };
}

export async function cli(args) {

    let options = parseArgumentsIntoOptions(args);

    //options = await promptForMissingOptions(options);

    await createAnalysis(options);

    console.log(options);
}