import { createTheming } from '@callstack/react-theme-provider';
import { Platform } from 'react-native';
import { getHeightPercent } from './ratio';
import constants from '../../../constants';
export const DEFAULT_THEME = {
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    backgroundColor: '#333333',
    onBackgroundTextColor: '#fff',
    fontSize: 16,
    fontFamily: Platform.select({
        ios: constants.Fonts.K2D_Regular,
        android: constants.Fonts.K2D_Regular,
        web: constants.Fonts.K2D_Regular
    }),
    filterPlaceholderTextColor: '#aaa',
    activeOpacity: 0.5,
    itemHeight: getHeightPercent(7),
    flagSize: Platform.select({ android: 20, default: 30 }),
    flagSizeButton: Platform.select({ android: 20, default: 30 })
};
export const DARK_THEME = {
    ...DEFAULT_THEME,
    primaryColor: '#222',
    primaryColorVariant: '#444',
    backgroundColor: '#000',
    onBackgroundTextColor: '#fff'
};
const { ThemeProvider, useTheme } = createTheming(DEFAULT_THEME);
export { ThemeProvider, useTheme };
//# sourceMappingURL=CountryTheme.js.map