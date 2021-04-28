import expressFactory from './express/expressFactory';
import analysis from './_mocks/routes/analysis';

expressFactory({ routes: [analysis] });
