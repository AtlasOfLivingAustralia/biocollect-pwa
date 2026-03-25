import type { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  defaultRadius: 'lg',
  fontFamily: `Roboto, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`,
  headings: {
    fontFamily: `Lato, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`,
  },
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
    rust: [
      '#ffeee9',
      '#f9ddd7',
      '#ebbab0',
      '#df9485',
      '#d47561',
      '#ce6049',
      '#c44d34',
      '#b4462f',
      '#a13d28',
      '#8e311f',
    ],
  },
};
