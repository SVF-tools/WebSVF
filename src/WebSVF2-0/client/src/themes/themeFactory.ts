import { Theme } from '@material-ui/core/styles/createMuiTheme';

export interface IThemeFactory {
  (): Theme;
}
