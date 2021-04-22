import createMuiTheme, { ThemeOptions as MuiThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { IThemeFactory } from './themeFactory';

const themeOptions: MuiThemeOptions = {};

const defaultThemeFactory: IThemeFactory = () => createMuiTheme(themeOptions);

export default defaultThemeFactory;
