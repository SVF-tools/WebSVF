import mongoose from 'mongoose';
import config from './serverconfig.json';
import analysis from './routes/analysis';
import expressFactory from './express/expressFactory';
import projects from './routes/projects';
import files from './routes/files';

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

console.log('__dirname', __dirname);

expressFactory({ routes: [analysis, projects, files] });
