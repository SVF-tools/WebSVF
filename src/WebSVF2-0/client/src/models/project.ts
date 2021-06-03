import { IFolder } from './folder';

export interface IProject {
  id: string;
  name: string;
  folders: IFolder[];
}
