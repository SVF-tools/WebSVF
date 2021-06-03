import { Document, Schema, Types } from 'mongoose';
import { DocumentsConstants } from './DocumentsConstants';

export const fileSchema = new Schema({
  folder: { type: Types.ObjectId, required: true, ref: DocumentsConstants.FolderDocument },
  name: { type: String, required: true },
  content: { type: String, required: true }
});

export interface IFileDocument extends Document<Types.ObjectId> {
  folder: Types.ObjectId;
  name: string;
  content: string;
}
