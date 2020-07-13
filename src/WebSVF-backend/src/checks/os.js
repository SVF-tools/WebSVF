import getos from 'getos';
import Listr from 'listr';
import chalk from 'chalk';
import { promisify } from 'util';

const getOS = promisify(getos);

const config_JSON = {};

const logMessage = async (os) => {
  const tasks = new Listr([
    {
      title: 'Checking OS Compatibility',
      enabled: () => true,
      task: () => {
        if (os.os && !os.dist) {
          console.error(
            `\n${chalk.red.bold(
              'ERROR'
            )} Sorry WebSVF is not compatible with ${chalk.cyan.bold(
              `${os}`
            )}${'\n'.repeat(2)}${chalk.black.bgWhite(
              '-- Please check back later --'
            )}`
          );

          throw new Error('Not Compatible');
        } else if (
          !(os.release.includes('18.04') || os.release.includes('20.04'))
        ) {
          console.error(
            `\n${chalk.red.bold(
              'ERROR'
            )} Sorry WebSVF is not compatible with version ${chalk.yellow(
              `${os.release}`
            )} of ${chalk.cyan.bold(`${os.dist}`)}${'\n'.repeat(
              2
            )}${chalk.black.bgWhite('-- Please check back later --')}`
          );

          throw new Error('Not Compatible');
        }
      },
    },
  ]);

  //Run the list of tasks defined above
  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export async function checkOS(options) {
  let error = null;

  return new Promise((resolve, reject) => {
    try {
      getOS()
        .then(async (os) => {
          await logMessage(os);

          resolve({
            ...options,
            check: true,
          });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
}
