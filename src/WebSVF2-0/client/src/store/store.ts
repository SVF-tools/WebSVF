import { configureStore, createReducer } from '@reduxjs/toolkit';
import { IProject } from '../models/project';
import { reducers } from './reducers';

export interface IStore {
  projects?: IProject[];
}

const initialStoreState: IStore = {};

export const store = configureStore({ reducer: createReducer(initialStoreState, reducers) });
