import { Express } from 'express';
import { IRoutesFactory } from './routesFactory';
import util from 'util';
import execa from 'execa';
import path from 'path';
import fs from 'fs';

const fs_writeFile = util.promisify(fs.writeFile);
const fs_unlink = util.promisify(fs.unlink);

const builds: IRoutesFactory = (app: Express) => {
  app.post('/build/cFile', async (req, res) => {
    const filePath = `${path.resolve('./')}/temp/${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    //Create a C file temporarily (for compiling) from the code in the request
    await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

    //Execute the wllvm compile to bc script on the C code sent through the POST request
    try {
      const result = await execa('sh', ['cFile2bc.sh', filePath], {
        cwd: shellScriptsPath
      });
      //console.log(result);

      //Save created .bc file to MongoDB

      if (!result.failed) {
        // Delete the files created
        try {
          await fs_unlink(`${filePath}.c`);
          await fs_unlink(`${filePath}.bc`);
        } catch (err) {
          res.status(417).send({
            message: 'Issue deleting local files',
            error: err
          });
        }
      }

      res.send(result);
    } catch (err) {
      res.status(417).send({
        message: 'Issue executing build file',
        error: err
      });
    }
  });
};

export default builds;
