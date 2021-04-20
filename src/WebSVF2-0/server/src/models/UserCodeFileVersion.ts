import { Schema } from 'mongoose';

export const userCodeFileVersionSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String
});

export interface IUserCodeFileVersion {
  fileName: string;
  version: string;
  fileID: string;
  content: string;
}
