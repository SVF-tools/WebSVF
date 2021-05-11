import { Express } from 'express';
import { ISaveFile } from '../models/File';
import { projectsServiceFactory } from '../services/projects-service';
import { IRoutesFactory } from './routesFactory';

const projectsService = projectsServiceFactory();

const files: IRoutesFactory = (app: Express) => {
  app.post('/files/:id', async (req, res) => {
    const file = await projectsService.saveFile({ id: req.params.id as string, data: req.body as ISaveFile });
    res.status(200).send(file);
  });
};

export default files;
