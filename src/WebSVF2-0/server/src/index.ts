import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import config from './serverconfig.json';
import userCode from './routes/userCode';
import db from './routes/db';
import builds from './routes/builds';
import analysis from './routes/analysis';

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoURI);

const app = express();

//Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Import Routes
userCode(app);
db(app);
builds(app);
analysis(app);

const PORT = process.env.PORT || 5001;
const host = `http://localhost:${PORT}`;
app.listen(PORT, () => console.log(`Running server on ${host}`));
