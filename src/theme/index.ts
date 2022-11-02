import palette from './palette';

interface Theme {
  type: 'light' | 'dark';
  radius: number;
  skeleton: string;
  defaults: {
    viewPadding: number;
  };
  font: {
    header: string;
    body: string;
    button: string;
    chip: string;
  };
  background: ThemeColour;
  text: ThemeColour;
  colour: ThemeColour;
  button: ThemeColour;
  chip: ThemeColour;
}

interface ThemeColour {
  primary: string;
  secondary: string;
  tertiary?: string;
}

const themes: { [key: string]: Theme } = {
  light: {
    type: 'light',
    radius: 12,
    skeleton: '#ecebeb',
    defaults: {
      viewPadding: 20,
    },
    font: {
      header: 'Lato',
      body: 'RobotoRegular',
      button: 'RobotoBold',
      chip: 'RobotoBold',
    },
    background: {
      primary: '#FFFFFF',
      secondary: palette.secondary.concrete,
      tertiary: '#cecece',
    },
    text: {
      primary: palette.secondary.charcoal,
      secondary: palette.primary.grey,
    },
    colour: {
      primary: palette.primary.flamingo,
      secondary: palette.primary.rust,
    },
    button: {
      primary: palette.primary.flamingo,
      secondary: palette.primary.rust,
    },
    chip: {
      primary: palette.extended.paleMoss,
      secondary: palette.extended.plum,
    },
  },
  dark: {
    type: 'dark',
    radius: 12,
    skeleton: '#646464',
    font: {
      header: 'Lato',
      body: 'RobotoRegular',
      button: 'RobotoBold',
      chip: 'RobotoBold',
    },
    defaults: {
      viewPadding: 20,
    },
    background: {
      primary: palette.secondary.charcoal,
      secondary: '#373737',
      tertiary: '#555555',
    },
    text: {
      primary: '#FFFFFF',
      secondary: palette.secondary.silver,
    },
    colour: {
      primary: palette.primary.flamingo,
      secondary: palette.primary.rust,
    },
    button: {
      primary: palette.primary.flamingo,
      secondary: palette.primary.rust,
    },
    chip: {
      primary: palette.extended.paleMoss,
      secondary: palette.extended.plum,
    },
  },
};

export { palette, themes };
