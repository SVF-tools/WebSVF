import { Express } from 'express';
import { projectsServiceFactory } from '../services/projects-service';
import { IRoutesFactory } from './routesFactory';

const projectsService = projectsServiceFactory();

const projects: IRoutesFactory = (app: Express) => {
  app.get('/projects/', async (req, res) => {
    const projects = await projectsService.getProjects();
    res.status(200).send(projects);
  });
  app.get('/projects/:projectId', async (req, res) => {
    const project = await projectsService.getProject(req.params.projectId as string);

    res.status(200).send(project);
  });
};

export default projects;
