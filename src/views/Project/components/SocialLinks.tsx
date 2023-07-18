import { ActionIcon, Group, Paper } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandFlickr,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandTumblr,
  IconBrandTwitter,
  IconBrandVimeo,
  IconBrandYoutube,
  IconRss,
  TablerIcon,
} from '@tabler/icons';
import { ProjectLink } from 'types';

const roleToIcon: { [key: string]: TablerIcon } = {
  facebook: IconBrandFacebook,
  flickr: IconBrandFlickr,
  googlePlus: IconBrandGoogle,
  instagram: IconBrandInstagram,
  linkedIn: IconBrandLinkedin,
  pinterest: IconBrandPinterest,
  rssFeed: IconRss,
  tumblr: IconBrandTumblr,
  twitter: IconBrandTwitter,
  vimeo: IconBrandVimeo,
  youtube: IconBrandYoutube,
};

interface SocialLinksProps {
  links: ProjectLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <Group spacing="xs">
      {links.map((link) => {
        const Icon = roleToIcon[link.role];
        return (
          <ActionIcon
            key={link.role}
            component="a"
            href={link.url}
            target="_blank"
            variant="outline"
            size="lg"
            radius="md"
          >
            <Icon />
          </ActionIcon>
        );
      })}
    </Group>
  );
}
