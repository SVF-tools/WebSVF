import { ThunkAction } from 'redux-thunk';
import { Action } from '@reduxjs/toolkit';

export type ThunkResult<TResponse, TStore> = ThunkAction<TResponse, TStore, undefined, Action<string>>;

export type ThunkResultAction<TParams, TResponse, TStore> = (params?: TParams) => ThunkResult<TResponse, TStore>;
