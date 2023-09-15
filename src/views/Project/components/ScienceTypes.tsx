import { Group, Paper, Text, ThemeIcon } from '@mantine/core';
import {
  IconActivity,
  IconActivityHeartbeat,
  IconAffiliate,
  IconBug,
  IconBulb,
  IconCodeDots,
  IconDna,
  IconDna2,
  IconDog,
  IconDroplet,
  IconFeather,
  IconFirstAidKit,
  IconFlame,
  IconFlask,
  IconGlobe,
  IconLeaf,
  IconMap,
  IconMeteor,
  IconMountain,
  IconPaw,
  IconRipple,
  IconRobot,
  IconShare,
  IconShovel,
  IconSubtask,
  IconTelescope,
  IconTrees,
  IconUsers,
  IconWorld,
  IconZoomCheck,
  Icon,
} from '@tabler/icons-react';
import { ProjectLink } from 'types';

const typeToIcon: { [key: string]: Icon } = {
  Animals: IconDog,
  'Agricultural & veterinary science': IconPaw,
  Astronomy: IconTelescope,
  Biology: IconDna2,
  Biodiversity: IconShare,
  Biogeography: IconMap,
  Birds: IconFeather,
  'Chemical sciences': IconFlask,
  'Climate & meteorology': IconMeteor,
  Ecology: IconLeaf,
  'Ecology & Environment': IconWorld,
  'Fire Ecology': IconFlame,
  Genetics: IconDna,
  'Geology & soils': IconShovel,
  Geomorphology: IconMountain,
  'Indigenous science': IconZoomCheck,
  'Indigenous knowledge': IconBulb,
  'Information & computing sciences': IconCodeDots,
  'Insects & Pollinators': IconBug,
  'Long-Term Species Monitoring': IconActivityHeartbeat,
  'Marine & Terrestrial': IconGlobe,
  'Medical & human health': IconFirstAidKit,
  'Nature & Outdoors': IconTrees,
  NRM: IconSubtask,
  Ocean: IconRipple,
  'Physical science': IconActivity,
  'Social sciences': IconUsers,
  'Symbyotic Interactions': IconAffiliate,
  Technology: IconRobot,
  Water: IconDroplet,
};

interface ScienceTypesProps {
  types: string[];
}

export function ScienceTypes({ types }: ScienceTypesProps) {
  return (
    <Group spacing="sm">
      {types.map((type) => {
        const Icon = typeToIcon[type];
        return (
          <Paper withBorder key={type} p={6}>
            <Group spacing="xs">
              <ThemeIcon variant="light" size="md" radius="lg">
                <Icon size="1rem" />
              </ThemeIcon>
              <Text size="sm" color="dimmed">
                {type}
              </Text>
            </Group>
          </Paper>
        );
      })}
    </Group>
  );
}
