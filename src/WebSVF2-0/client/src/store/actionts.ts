import { createAction } from '@reduxjs/toolkit';
import webSvgApiFactory from '../api/webSvfApi';
import { IProject } from '../models/project';
import { IStore } from './store';
import { ThunkResultAction } from './thunkResultAction';

export const projectsUpdated = createAction<IProject[]>('projectsUpdated');

const webSvfApi = webSvgApiFactory();

export const fetchProjects: ThunkResultAction<never, void, IStore> = () => {
  return async (dispatch) => {
    const projects = await webSvfApi.getProjects();
    dispatch(projectsUpdated(projects));
  };
};
