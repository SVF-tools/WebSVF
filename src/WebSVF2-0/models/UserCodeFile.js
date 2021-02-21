const mongoose = require('mongoose');
const { Schema } = mongoose;

const userCodeFileSchema = new Schema({
  fileName: String,
  version: String,
  fileID: String,
  content: String,
});
