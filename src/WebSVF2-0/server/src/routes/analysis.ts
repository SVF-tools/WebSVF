import { Express } from 'express';
import util from 'util';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import { IRoutesFactory } from './routesFactory';

const fs_writeFile = util.promisify(fs.writeFile);

const tempPath = `${path.resolve('./')}/src/temp/`;
const shellScriptsPath = `${path.resolve('./')}/src/scripts/`;

if (!fs.existsSync(tempPath)) {
  console.log(`Creating directory ${tempPath}`);
  fs.mkdirSync(tempPath);
}

console.log('tempPath', tempPath);
console.log('shellScriptsPath', shellScriptsPath);

type GraphNameType = 'callgraph' | 'icfg' | 'pag' | 'svfg' | 'vfg';

interface IProcessAnalysisRequestProps {
  graphName: GraphNameType;
  scriptFileName: string;
  code: string;
  codeFileName: string;
  onSvgOpen: (stream: fs.ReadStream) => void;
}

const createTemporaryFile = async (codeFileName: string, code: string) => {
  const filePath = `${tempPath}${codeFileName}`;
  try {
    await fs_writeFile(`${filePath}.c`, `${code}`);
  } catch (error) {
    throw new Error('Error creating local C file: ' + error);
  }
};

const copyScript = async (scriptFileName: string) => {
  try {
    await execa('cp', [scriptFileName, tempPath], {
      cwd: shellScriptsPath
    });
  } catch (error) {
    throw new Error('Error copying script: ' + error);
  }
};

const executeScript = async (scriptFileName: string, codeFileName: string) => {
  try {
    return await execa('bash', [`./${scriptFileName}`, `${codeFileName}.c`], {
      cwd: tempPath,
      shell: true
    });
  } catch (error) {
    throw new Error('Error executing script: ' + error);
  }
};

const readGraphSvg = async (graphName: string) => {
  try {
    return fs.createReadStream(`${tempPath}Graph_Files/svf/${graphName}.svg`);
  } catch (error) {
    throw new Error('Error reading graph svg: ' + error);
  }
};

const cleanupFiles = async () => {
  try {
    await execa('rm', ['-rf', '*'], {
      cwd: tempPath,
      shell: true
    });
  } catch (error) {
    throw new Error('Error cleaning up files: ' + error);
  }
};

const processAnalysisRequest = async ({ graphName, scriptFileName, code, codeFileName, onSvgOpen }: IProcessAnalysisRequestProps) => {
  await createTemporaryFile(codeFileName, code);

  await copyScript(scriptFileName);

  await executeScript(scriptFileName, codeFileName);

  const stream = await readGraphSvg(graphName);

  onSvgOpen(stream);
};

const analysis: IRoutesFactory = (app: Express) => {
  app.post('/analysis/:graphName', async (req, res) => {
    try {
      const graphName = req.params.graphName as GraphNameType;
      const { code, fileName }: { code: string; fileName: string } = req.body;

      if (!code || !fileName) {
        res.status(400).send({
          message: 'Missing code or file name'
        });
      }

      await processAnalysisRequest({
        graphName: graphName,
        scriptFileName: 'gen2DGraphs.sh',
        code: code,
        codeFileName: fileName,
        onSvgOpen: (stream) => {
          stream.on('open', function () {
            res.set('Content-Type', 'image/svg+xml');
            stream.pipe(res);
            cleanupFiles();
          });
        }
      });
    } catch (error) {
      res.status(417).send({
        message: 'Error executing analysis',
        error: error
      });
    }
  });
};

export default analysis;
