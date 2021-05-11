export interface IFile {
  id: string;
  folderId: string;
  name: string;
  content: string;
}

export interface ISaveFile {
  folderId?: string;
  name: string;
  content: string;
}
