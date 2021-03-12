const mongoose = require('mongoose');
const { Schema } = mongoose;
//require('./UserCode');

const userCodeFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
});

const userCodeSchema = new Schema({
  file: userCodeFileSchema,
});

const projectSchema = new Schema({
  projectID: String,
  userCode: userCodeSchema,
});
