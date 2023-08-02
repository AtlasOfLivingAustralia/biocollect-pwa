import { MantineThemeOverride } from '@mantine/core';
import { generateShades } from './shades';
import * as palette from './palette';

const generateTheme = (
  theme: MantineThemeOverride = {}
): MantineThemeOverride => ({
  // Default theme settings
  defaultRadius: 'md',
  fontFamily: `Roboto, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`,
  headings: {
    fontFamily: `Lato, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`,
  },
  // Additional ALA colours
  colors: {
    ...theme.colors,
    ...palette.primary,
    ...palette.secondary,
    ...palette.extended,
  },
  ...theme,
});

const themes: { [key: string]: MantineThemeOverride } = {
  light: generateTheme({ colorScheme: 'light' }),
  dark: generateTheme({ colorScheme: 'dark' }),
  ala: generateTheme({
    colors: {
      alablue: generateShades('#009080'),
    },
    primaryColor: 'alablue',
    colorScheme: 'dark',
  }),
};

export { themes, palette, generateShades };
