import { Document, Schema, Types } from 'mongoose';
import { DocumentsConstants } from './DocumentsConstants';

export const folderSchema = new Schema({
  project: { type: Types.ObjectId, required: true, ref: DocumentsConstants.ProjectDocument },
  name: { type: String, required: true }
});

export interface IFolderDocument extends Document<Types.ObjectId> {
  name: string;
  project: Types.ObjectId;
}
