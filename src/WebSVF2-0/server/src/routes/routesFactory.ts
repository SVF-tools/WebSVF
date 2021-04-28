import { Express } from 'express';

export interface IRoutesFactory {
  (app: Express): void;
}
