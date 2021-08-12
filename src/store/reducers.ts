import { PayloadAction } from '@reduxjs/toolkit';
import { IFile } from '../models/file';
import { IProject } from '../models/project';
import { projectsUpdated, selectedFileUpdated } from './actionts';
import { IStore } from './store';

export interface IReducers<T> {
  [key: string]: { (state: T, action: PayloadAction<any>): void };
}

export const reducers: IReducers<IStore> = {};

reducers[projectsUpdated.type] = (state: IStore, action: PayloadAction<IProject[]>) => {
  state.projects = action.payload;
};

reducers[selectedFileUpdated.type] = (state: IStore, action: PayloadAction<IFile>) => {
  state.selectedFile = action.payload;
};
