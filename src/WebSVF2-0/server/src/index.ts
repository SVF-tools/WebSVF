import mongoose from 'mongoose';
import config from './serverconfig.json';
import builds from './routes/builds';
import analysis from './routes/analysis';
import expressFactory from './express/expressFactory';
import projects from './routes/projects';

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoURI);

console.log('__dirname', __dirname);

expressFactory({ routes: [projects, builds, analysis] });
