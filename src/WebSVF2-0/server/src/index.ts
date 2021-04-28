import mongoose from 'mongoose';
import config from './serverconfig.json';
import userCode from './routes/userCode';
import db from './routes/db';
import builds from './routes/builds';
import analysis from './routes/analysis';
import expressFactory from './express/expressFactory';

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoURI);

console.log('__dirname', __dirname);

expressFactory({ routes: [userCode, db, builds, analysis] });
