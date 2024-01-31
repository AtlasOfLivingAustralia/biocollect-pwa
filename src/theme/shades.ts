import { Tuple } from '@mantine/core';
import Colour from 'color';

// Generates an array of shades for a specified hex string
// to be used with Mantine
export const generateShades = (
  colour: string,
  step = 0.125
): Tuple<string, 10> => {
  const out = [];
  const base = new Colour(colour);

  for (let shade = 7; shade > -3; shade -= 1) {
    out.push(
      (shade < 0
        ? base.darken(Math.abs(step * shade))
        : base.lighten(Math.abs(step * shade))
      ).hex()
    );
  }

  return out as Tuple<string, 10>;
};
