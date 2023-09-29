import { Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function Welcome() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return mobile ? <Text>Mobile</Text> : <Text>Desktop</Text>;
}
