import { Document, Schema, Types } from 'mongoose';

export const projectSchema = new Schema({
  name: { type: String, required: true }
});

export interface IProjectDocument extends Document<Types.ObjectId> {
  name: string;
}
