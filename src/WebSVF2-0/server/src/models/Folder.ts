import { IFile } from './File';

export interface IFolder {
  id: string;
  projectId: string;
  name: string;
  files: IFile[];
}
