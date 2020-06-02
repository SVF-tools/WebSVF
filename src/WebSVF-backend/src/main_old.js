import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

//Copy files from the template directory to the target directory using ncp node module (clobber: false means files won't be overwritten in target directory)
async function copyTemplateFiles(options) {
 return copy(options.templateDirectory, options.targetDirectory, {
   clobber: false,
 });
}

//Execute Init Git in the target directory using execa node module
async function initGit(options) {
    const result = await execa('git', ['init'], {
      cwd: options.targetDirectory,
    });
    if (result.failed) {
      return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

export async function createProject(options) {

 //Add on to the options object as parsed from the command line arguements
 options = {
   ...options,
   targetDirectory: options.targetDirectory || process.cwd(),
 };

 //Resolve the location/path of the directory to copy
 const currentFileUrl = import.meta.url;
 const templateDir = path.resolve(
    decodeURI(new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1)),
   '../../templates',
   options.template.toLowerCase()
 );
 options.templateDirectory = templateDir;

 //Check if the directory to copy is readable on the machine and if the yser entered the wrong template string
 try {
   await access(templateDir, fs.constants.R_OK);
 } catch (err) {
   console.error('%s Invalid template name', chalk.red.bold('ERROR'));
   process.exit(1);
 }

 //Define the list of tasks to run using the listr node module
 const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      //Install npm dependencies using npm or yarn (based on the package.json file or yarn-lock file present in targetDirectory)
      //Using the projectInstall function from the pkg-install node module
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);
 
  //Run the list of tasks defined above
  await tasks.run();

  //Display final statement and fulfill promise
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}