import { IFile } from './file';

export interface IFolder {
  id: string;
  projectId: string;
  name: string;
  files: IFile[];
}
