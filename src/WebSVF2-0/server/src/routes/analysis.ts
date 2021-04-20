import { Express } from 'express';
import util from 'util';
import execa from 'execa';
import path from 'path';
import fs from 'fs';

const fs_writeFile = util.promisify(fs.writeFile);

const tempPath = `${path.resolve('./')}/temp/`;

const analysis = (app: Express) => {
  app.post('/analysis/callGraph', async (req, res) => {
    const filePath = `${tempPath}${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    if (!Boolean(req.body.code)) {
      res.status(400).send({
        message: 'Code is not right'
      });
    } else {
      //Create a C file temporarily (for compiling) from the code in the request
      await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

      //Copy script for generating graphs to temp folder
      try {
        await execa('cp', ['gen2DGraphs.sh', tempPath], {
          cwd: shellScriptsPath
        });
      } catch (err) {
        console.log(err);
      }

      //Execute the wllvm compile to bc script on the C code sent through the POST request
      try {
        const result = await execa('bash', ['./gen2DGraphs.sh', `${req.body.fileName}.c`], {
          cwd: tempPath,
          shell: true
        });

        //Respond to the Request with the CallGraph
        var s = fs.createReadStream(`${tempPath}/Graph_Files/svf/callgraph.svg`);
        s.on('open', function () {
          res.set('Content-Type', 'image/svg+xml');
          s.pipe(res);
        });

        //Cleanup the Files
        if (!result.failed) {
          // Delete the files created
          try {
            await execa('rm', ['-rf', '*'], {
              cwd: tempPath,
              shell: true
            });
          } catch (err) {
            res.status(417).send({
              message: 'Issue deleting local files',
              error: err
            });
            //console.log(err);
          }
        }
      } catch (err) {
        res.status(417).send({
          message: 'Issue executing build file',
          error: err
        });
        //console.log(err);
      }
    }
  });

  app.post('/analysis/icfg', async (req, res) => {
    const filePath = `${tempPath}${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    if (!Boolean(req.body.code)) {
      res.status(400).send({
        message: 'Code is not right'
      });
    } else {
      //Create a C file temporarily (for compiling) from the code in the request
      await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

      //Copy script for generating graphs to temp folder
      try {
        await execa('cp', ['gen2DGraphs.sh', tempPath], {
          cwd: shellScriptsPath
        });
      } catch (err) {
        console.log(err);
      }

      //Execute the wllvm compile to bc script on the C code sent through the POST request
      try {
        const result = await execa('bash', ['./gen2DGraphs.sh', `${req.body.fileName}.c`], {
          cwd: tempPath,
          shell: true
        });

        //Respond to the Request with the CallGraph
        var s = fs.createReadStream(`${tempPath}/Graph_Files/svf/icfg.svg`);
        s.on('open', function () {
          res.set('Content-Type', 'image/svg+xml');
          s.pipe(res);
        });

        //Cleanup the Files
        if (!result.failed) {
          // Delete the files created
          try {
            await execa('rm', ['-rf', '*'], {
              cwd: tempPath,
              shell: true
            });
          } catch (err) {
            res.status(417).send({
              message: 'Issue deleting local files',
              error: err
            });
          }
        }
      } catch (err) {
        res.status(417).send({
          message: 'Issue executing build file',
          error: err
        });
      }
    }
  });

  app.post('/analysis/pag', async (req, res) => {
    const filePath = `${tempPath}${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    if (!Boolean(req.body.code)) {
      res.status(400).send({
        message: 'Code is not right'
      });
    } else {
      //Create a C file temporarily (for compiling) from the code in the request
      await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

      //Copy script for generating graphs to temp folder
      try {
        await execa('cp', ['gen2DGraphs.sh', tempPath], {
          cwd: shellScriptsPath
        });
      } catch (err) {
        console.log(err);
      }

      //Execute the wllvm compile to bc script on the C code sent through the POST request
      try {
        const result = await execa('bash', ['./gen2DGraphs.sh', `${req.body.fileName}.c`], {
          cwd: tempPath,
          shell: true
        });

        //Respond to the Request with the CallGraph
        var s = fs.createReadStream(`${tempPath}/Graph_Files/svf/pag.svg`);
        s.on('open', function () {
          res.set('Content-Type', 'image/svg+xml');
          s.pipe(res);
        });

        //Cleanup the Files
        if (!result.failed) {
          // Delete the files created
          try {
            await execa('rm', ['-rf', '*'], {
              cwd: tempPath,
              shell: true
            });
          } catch (err) {
            res.status(417).send({
              message: 'Issue deleting local files',
              error: err
            });
          }
        }
      } catch (err) {
        res.status(417).send({
          message: 'Issue executing build file',
          error: err
        });
      }
    }
  });

  app.post('/analysis/svfg', async (req, res) => {
    const filePath = `${tempPath}${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    if (!Boolean(req.body.code)) {
      res.status(400).send({
        message: 'Code is not right'
      });
    } else {
      //Create a C file temporarily (for compiling) from the code in the request
      await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

      //Copy script for generating graphs to temp folder
      try {
        await execa('cp', ['gen2DGraphs.sh', tempPath], {
          cwd: shellScriptsPath
        });
      } catch (err) {
        console.log(err);
      }

      //Execute the wllvm compile to bc script on the C code sent through the POST request
      try {
        const result = await execa('bash', ['./gen2DGraphs.sh', `${req.body.fileName}.c`], {
          cwd: tempPath,
          shell: true
        });

        //Respond to the Request with the CallGraph
        var s = fs.createReadStream(`${tempPath}/Graph_Files/svf/svfg.svg`);
        s.on('open', function () {
          res.set('Content-Type', 'image/svg+xml');
          s.pipe(res);
        });

        //Cleanup the Files
        if (!result.failed) {
          // Delete the files created
          try {
            await execa('rm', ['-rf', '*'], {
              cwd: tempPath,
              shell: true
            });
          } catch (err) {
            res.status(417).send({
              message: 'Issue deleting local files',
              error: err
            });
          }
        }
      } catch (err) {
        res.status(417).send({
          message: 'Issue executing build file',
          error: err
        });
      }
    }
  });

  app.post('/analysis/vfg', async (req, res) => {
    const filePath = `${tempPath}${req.body.fileName}`;
    const shellScriptsPath = `${path.resolve('./')}/scripts`;

    if (!Boolean(req.body.code)) {
      res.status(400).send({
        message: 'Code is not right'
      });
    } else {
      //Create a C file temporarily (for compiling) from the code in the request
      await fs_writeFile(`${filePath}.c`, `${req.body.code}`);

      //Copy script for generating graphs to temp folder
      try {
        await execa('cp', ['gen2DGraphs.sh', tempPath], {
          cwd: shellScriptsPath
        });
      } catch (err) {
        console.log(err);
      }

      //Execute the wllvm compile to bc script on the C code sent through the POST request
      try {
        const result = await execa('bash', ['./gen2DGraphs.sh', `${req.body.fileName}.c`], {
          cwd: tempPath,
          shell: true
        });

        //Respond to the Request with the CallGraph
        var s = fs.createReadStream(`${tempPath}/Graph_Files/svf/vfg.svg`);
        s.on('open', function () {
          res.set('Content-Type', 'image/svg+xml');
          s.pipe(res);
        });

        //Cleanup the Files
        if (!result.failed) {
          // Delete the files created
          try {
            await execa('rm', ['-rf', '*'], {
              cwd: tempPath,
              shell: true
            });
          } catch (err) {
            res.status(417).send({
              message: 'Issue deleting local files',
              error: err
            });
          }
        }
      } catch (err) {
        res.status(417).send({
          message: 'Issue executing build file',
          error: err
        });
      }
    }
  });
};

export default analysis;
