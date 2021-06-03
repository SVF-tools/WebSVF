import { IFolder } from './Folder';

export interface IProject {
  id: string;
  name: string;
  folders: IFolder[];
}
