import { Theme } from '@material-ui/core/styles/createTheme';

export interface IThemeFactory {
  (): Theme;
}
