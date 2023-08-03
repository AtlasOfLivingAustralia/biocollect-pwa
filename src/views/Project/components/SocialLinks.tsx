import { ActionIcon, Group, GroupProps, Paper, Tooltip } from '@mantine/core';
import {
  IconBrandAndroid,
  IconBrandApple,
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
  iTunes: IconBrandApple,
  android: IconBrandAndroid,
};

interface SocialLinksProps extends GroupProps {
  links: ProjectLink[];
}

export function SocialLinks({ links, ...rest }: SocialLinksProps) {
  return (
    <Group spacing="xs" {...rest}>
      {links.map((link) => {
        const Icon = roleToIcon[link.role];
        if (!Icon) return null;

        return (
          <Tooltip key={link.role} label={link.role} position="top">
            <ActionIcon
              component="a"
              href={link.url}
              target="_blank"
              variant="filled"
              size="xl"
              radius="lg"
            >
              <Icon />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
