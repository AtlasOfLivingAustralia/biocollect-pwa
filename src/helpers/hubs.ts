import logoAcsa from '/assets/logo-hub-acsa.png';
import logoBiocontrol from '/assets/logo-hub-biocontrol.png';
import logoEcoScience from '/assets/logo-hub-ecoscience.png';
import logoTracks from '/assets/logo-hub-tracks.png';
import logoCoralWatch from '/assets/logo-hub-coralwatch.png';
import logoMM2 from '/assets/logo-hub-mm2.png';

export interface Hub {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export const hubs: { [id: string]: Hub } = {
  acsa: {
    id: 'acsa', // Must be the same as key
    name: 'Citizen Science',
    description:
      'Public participation and collaboration in scientific research with the aim to increase scientific knowledge.',
    logo: logoAcsa,
  },
  biocontrolhub: {
    id: 'biocontrolhub',
    name: 'BioControl',
    description:
      'Empowering biocontrol monitoring by turning field observations into accessible, long-term biodiversity data.',
    logo: logoBiocontrol,
  },
  ecoscience: {
    id: 'ecoscience', // Must be the same as key
    name: 'Ecological Science',
    description:
      'Public participation and collaboration in scientific research with the aim to increase scientific knowledge.',
    logo: logoEcoScience,
  },
  coralwatch: {
    id: 'coralwatch',
    name: 'CoralWatch',
    description:
      'Global coral health monitoring with education and public outreach creating reef awareness.',
    logo: logoCoralWatch,
  },
  mm2: {
    id: 'mm2',
    name: 'Marine Meter Squared',
    description:
      'Share your findings in our database so you and others can discover how your local seashore is changing.',
    logo: logoMM2,
  },
  trackshub: {
    id: 'trackshub',
    name: 'Tracks',
    description:
      'Collect information on tracks and other sign (scats, diggings, burrows, bones, and feathers)',
    logo: logoTracks,
  },
};
