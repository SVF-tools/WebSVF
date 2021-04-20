import { Schema, Document } from 'mongoose';
import { IProject, projectSchema } from './Projects';

export const userSchema = new Schema({
  googleID: String,
  projects: [projectSchema]
});

export interface IUser extends Document {
  googleID: string;
  projects: IProject[];
}
