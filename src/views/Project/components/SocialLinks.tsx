import { ActionIcon, Group, type GroupProps, Tooltip } from '@mantine/core';
import {
  type Icon,
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
} from '@tabler/icons-react';
import type { ProjectLink } from '#/types';

const roleToIcon: { [key: string]: Icon } = {
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
    <Group gap='xs' {...rest}>
      {links.map((link) => {
        const Icon = roleToIcon[link.role];
        if (!Icon) return null;

        return (
          <Tooltip key={link.role} label={link.role} position='top'>
            <ActionIcon
              component='a'
              href={link.url}
              target='_blank'
              variant='light'
              size='xl'
              radius='lg'
            >
              <Icon />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
