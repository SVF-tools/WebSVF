import { createAction } from '@reduxjs/toolkit';
import { webSvfApiFactory } from '../api/webSvfApi';
import { IFile } from '../models/file';
import { IProject } from '../models/project';
import { IStore } from './store';
import { ThunkResultAction } from './thunkResultAction';

export const projectsUpdated = createAction<IProject[]>('projectsUpdated');
export const selectedFileUpdated = createAction<IFile>('selectedFileUpdated');

const webSvfApi = webSvfApiFactory();

export const fetchProjects: ThunkResultAction<never, void, IStore> = () => {
  return async (dispatch) => {
    const projects = await webSvfApi.getProjects();
    dispatch(projectsUpdated(projects));
  };
};
