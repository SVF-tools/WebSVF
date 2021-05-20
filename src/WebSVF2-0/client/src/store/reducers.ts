import { PayloadAction } from '@reduxjs/toolkit';
import { IProject } from '../models/project';
import { projectsUpdated } from './actionts';
import { IStore } from './store';

export interface IReducers<T> {
  [key: string]: { (state: T, action: PayloadAction<any>): void };
}

export const reducers: IReducers<IStore> = {};

reducers[projectsUpdated.type] = (state: IStore, action: PayloadAction<IProject[]>) => {
  state.projects = action.payload;
};
