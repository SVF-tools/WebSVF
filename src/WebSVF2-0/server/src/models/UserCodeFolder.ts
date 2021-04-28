import { Schema } from 'mongoose';
import { IUserCodeFile, userCodeFileSchema } from './UserCodeFile';

export const userCodeFolderSchema = new Schema({
  folderID: String,
  folderName: String,
  files: [userCodeFileSchema]
});

export interface IUserCodeFolder {
  folderID: string;
  folderName: string;
  files: IUserCodeFile[];
}
