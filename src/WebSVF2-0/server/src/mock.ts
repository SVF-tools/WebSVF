import expressFactory from './express/expressFactory';
import files from './routes/files';
import projects from './routes/projects';
import analysis from './_mocks/routes/analysis';

expressFactory({ routes: [analysis, projects, files] });
