const mongoose = require('mongoose');
const { Schema } = mongoose;
//require('./UserCodeFile');

const userCodeFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
});

const userCodeSchema = new Schema({
  file: userCodeFileSchema,
});
