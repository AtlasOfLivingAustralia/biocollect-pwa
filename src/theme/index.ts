import { MantineThemeOverride } from '@mantine/core';
import palette from './palette';

const fontStack = `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`;
const defaults: MantineThemeOverride = {
  fontFamily: `Roboto, ${fontStack}`,
  headings: {
    fontFamily: `Lato, ${fontStack}`,
  },
  defaultRadius: 'sm',
  // colors: {
  //   test: [],
  // },
  // primaryColor: 'test',
};

const themes: { [key: string]: MantineThemeOverride } = {
  light: {
    ...defaults,
    colorScheme: 'light',
  },
  dark: {
    ...defaults,
    colorScheme: 'dark',
  },
};

export { palette, themes };
