import { Schema } from 'mongoose';
import { IUserCodeFolder, userCodeFolderSchema } from './UserCodeFolder';

export const projectSchema = new Schema({
  projectID: String,
  userCode: [userCodeFolderSchema]
});

export interface IProject {
  projectID: string;
  userCode: IUserCodeFolder[];
}
