import { Express } from 'express';
import { IRoutesFactory } from './routesFactory';

const userCode: IRoutesFactory = (app: Express) => {
  app.get('/', async (req, res) => {
    res.send('You have Reached localhost:5001/');
  });
};

export default userCode;
