import { Badge, type BadgeProps, Image } from '@mantine/core';
import logoAla from '/assets/logo-ala.png';

export const ALABadge = (props: BadgeProps) => (
  <Badge
    {...props}
    color='orange'
    variant='light'
    leftSection={<Image height={15} width='auto' src={logoAla} />}
  >
    Contributing to the ALA
  </Badge>
);
