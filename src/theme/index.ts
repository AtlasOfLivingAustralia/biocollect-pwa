import { MantineThemeOverride, Tuple } from '@mantine/core';
import palette from './palette';
import Colour from 'color';

function generateShades(colour: string, step = 0.125): Tuple<string, 10> {
  const out = [];
  const base = new Colour(colour);

  for (let shade = 7; shade > -3; shade -= 1) {
    const amount = Math.abs(step * shade);
    out.push((shade < 0 ? base.darken(amount) : base.lighten(amount)).hex());
  }

  return out as Tuple<string, 10>;
}

const fontStack = `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Oxygen, Ubuntu, sans-serif`;
const defaults: MantineThemeOverride = {
  fontFamily: `Roboto, ${fontStack}`,
  headings: {
    fontFamily: `Lato, ${fontStack}`,
  },
  defaultRadius: 'md',
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
  ala: {
    ...defaults,
    colors: {
      alablue: generateShades('#009080'),
    },
    primaryColor: 'alablue',
    colorScheme: 'dark',
  },
};

export { palette, themes, generateShades };
