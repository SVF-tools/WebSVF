const mongoose = require('mongoose');
const { Schema } = mongoose;
//require('./Projects');

const userCodeFileVersionSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
});

const userCodeFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
  versions: [userCodeFileVersionSchema],
});

const userCodeFolderSchema = new Schema({
  folderID: String,
  folderName: String,
  files: [userCodeFileSchema],
});

const projectSchema = new Schema({
  projectID: String,
  userCode: [userCodeFolderSchema],
});

const userSchema = new Schema({
  googleID: String,
  projects: [projectSchema],
});

module.exports = mongoose.model('users', userSchema);
