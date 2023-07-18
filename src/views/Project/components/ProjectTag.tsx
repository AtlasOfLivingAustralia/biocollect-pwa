import { Badge } from '@mantine/core';
import {
  IconBabyCarriage,
  IconBooks,
  IconCurrencyDollarOff,
  IconHammer,
  IconHome,
  IconRobot,
  TablerIcon,
} from '@tabler/icons';

interface ProjectTagItem {
  icon: TablerIcon;
  name: string;
}

const projectTagData: { [key: string]: ProjectTagItem } = {
  isSciStarter: {
    icon: IconRobot,
    name: 'From SciStarter',
  },
  noCost: {
    icon: IconCurrencyDollarOff,
    name: 'Free',
  },
  hasTeachingMaterials: {
    icon: IconBooks,
    name: 'Teaching Materials',
  },
  isSuitableForChildren: {
    icon: IconBabyCarriage,
    name: 'For Children',
  },
  isHome: {
    icon: IconHome,
    name: 'Home',
  },
  isDIY: {
    icon: IconHammer,
    name: 'DIY',
  },
};

interface ProjectTagProps {
  tag: string;
}

export function ProjectTag({ tag }: ProjectTagProps) {
  const data = projectTagData[tag];
  if (!data) return null;

  const { icon: Icon, name } = data;

  return (
    <Badge
      color="gray"
      leftSection={<Icon style={{ marginTop: 4 }} size="0.8rem" />}
    >
      {name}
    </Badge>
  );
}
