import { Text } from '@mantine/core';
import { BioCollectProject } from 'types';

interface ProjectCardProps {
  project: BioCollectProject | null;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return <Text>{project?.name || 'loading'}</Text>;
}
