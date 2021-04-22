import { Express } from 'express';
import { IRoutesFactory } from '../../routes/routesFactory';

const analysis: IRoutesFactory = (app: Express) => {
  app.post('/analysis/callGraph', async (req, res) => {
    res.sendFile(__dirname + '/svgs/callGraph.svg');
  });

  app.post('/analysis/icfg', async (req, res) => {
    res.sendFile(__dirname + '/svgs/icfg.svg');
  });

  app.post('/analysis/pag', async (req, res) => {
    res.sendFile(__dirname + '/svgs/pag.svg');
  });

  app.post('/analysis/svfg', async (req, res) => {
    res.sendFile(__dirname + '/svgs/svfg.svg');
  });

  app.post('/analysis/vfg', async (req, res) => {
    res.sendFile(__dirname + '/svgs/vfg.svg');
  });
};

export default analysis;
