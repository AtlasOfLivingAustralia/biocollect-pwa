import { Button } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';


export function HelpButton() {
	return (
		<Button
			component='a'
			href="https://support.ala.org.au/support/solutions/articles/6000276298-biocollect-pwa-app/"
			target='_blank'
			size='compact-xs'
			variant='subtle'
			color='rust'
			leftSection={<IconHelpCircle size='1rem' />}
		>
			Help
		</Button>
	);
}
