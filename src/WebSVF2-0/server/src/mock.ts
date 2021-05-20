import mongoose from 'mongoose';
import config from './serverconfig.json';
import expressFactory from './express/expressFactory';
import files from './routes/files';
import projects from './routes/projects';
import analysis from './_mocks/routes/analysis';

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

expressFactory({ routes: [analysis, projects, files] });
