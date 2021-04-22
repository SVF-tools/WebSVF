import express, { Express } from 'express';
import cors from 'cors';
import { IRoutesFactory } from '../routes/routesFactory';

export interface IExpressFactoryProps {
  routes: IRoutesFactory[];
}

export interface IExpressFactory {
  (props: IExpressFactoryProps): Express;
}

const PORT = process.env.PORT || 5001;
const host = `http://localhost:${PORT}`;

const expressFactory: IExpressFactory = ({ routes }) => {
  const app = express();

  // Express Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  routes.forEach((route) => route(app));

  app.listen(PORT, () => console.log(`Running server on ${host}`));

  return app;
};

export default expressFactory;
