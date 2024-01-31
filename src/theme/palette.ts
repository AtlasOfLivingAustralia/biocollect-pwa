import { generateShades } from './shades';

// Raw colour hex codes
const hex = {
  primary: {
    flamingo: '#F26649',
    rust: '#C44D34',
    grey: '#637073',
  },
  secondary: {
    concrete: '#F2F2F2',
    silver: '#9D9D9D',
    charcoal: '#212121',
  },
  extended: {
    honey: '#FFC557',
    paleMoss: '#B7CD96',
    seafoam: '#6BDAD5',
    ocean: '#003A70',
    lavender: '#A191B2',
    plum: '#691C32',
  },
};

// Primary ALA colours
const primary = {
  rust: generateShades(hex.primary.rust),
  flamingo: generateShades(hex.primary.flamingo),
  grey: generateShades(hex.primary.grey),
};

// Secondary ALA colours
const secondary = {
  concrete: generateShades(hex.secondary.concrete),
  charcoal: generateShades(hex.secondary.charcoal),
  silver: generateShades(hex.secondary.silver),
};

// Extended ALA colours
const extended = {
  honey: generateShades(hex.extended.honey),
  paleMoss: generateShades(hex.extended.paleMoss),
  seafoam: generateShades(hex.extended.seafoam),
  ocean: generateShades(hex.extended.ocean),
  lavendar: generateShades(hex.extended.lavender),
  plum: generateShades(hex.extended.plum),
};

export { hex, primary, secondary, extended };
