import { useMantineTheme } from '@mantine/core';

// Simple wave
const SIMPLE_WAVE =
  'M0,160L60,170.7C120,181,240,203,360,208C480,213,600,203,720,181.3C840,160,960,128,1080,122.7C1200,117,1320,139,1380,149.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z';
const LESS_SIMPLE_WAVE =
  'M0,64L60,96C120,128,240,192,360,192C480,192,600,128,720,128C840,128,960,192,1080,208C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z';

export default function Wave(props: React.SVGProps<SVGSVGElement>) {
  const theme = useMantineTheme();
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill={theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#ffffff'}
        fillOpacity="1"
        d={LESS_SIMPLE_WAVE}
      ></path>
    </svg>
  );
}
