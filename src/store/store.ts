import { configureStore, createReducer } from '@reduxjs/toolkit';
import { IFile } from '../models/file';
import { IProject } from '../models/project';
import { reducers } from './reducers';

export interface IStore {
  projects?: IProject[];
  selectedFile?: IFile;
}

const initialStoreState: IStore = {};

export const store = configureStore({ reducer: createReducer(initialStoreState, reducers) });
