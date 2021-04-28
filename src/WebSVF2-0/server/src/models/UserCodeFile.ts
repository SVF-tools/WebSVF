import { Schema } from 'mongoose';
import { IUserCodeFileVersion, userCodeFileVersionSchema } from './UserCodeFileVersion';

export const userCodeFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
  versions: [userCodeFileVersionSchema]
});

export interface IUserCodeFile {
  fileName: string;
  version: string;
  fileID: string;
  content: string;
  versions: IUserCodeFileVersion[];
}
