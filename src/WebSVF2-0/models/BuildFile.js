const mongoose = require('mongoose');
const { Schema } = mongoose;

const buildFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  userCodeID: String,
  content: String,
});
