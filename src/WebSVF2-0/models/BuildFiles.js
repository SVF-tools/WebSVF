const mongoose = require('mongoose');
const { Schema } = mongoose;
require('./BuildFile');

const buildFilesSchema = new Schema({
  file: buildFileSchema,
});
