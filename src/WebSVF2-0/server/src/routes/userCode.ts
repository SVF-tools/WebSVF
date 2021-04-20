import { Express } from 'express';

const userCode = (app: Express) => {
  app.get('/', async (req, res) => {
    res.send('You have Reached localhost:5001/');
  });
};

export default userCode;
