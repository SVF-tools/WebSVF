import { Express } from 'express';
import { IRoutesFactory } from '../../routes/routesFactory';

const analysis: IRoutesFactory = (app: Express) => {
  app.post('/analysis/:graphName', async (req, res) => {
    res.sendFile(__dirname + '/svgs/' + req.params.graphName + '.svg');
  });
};

export default analysis;
