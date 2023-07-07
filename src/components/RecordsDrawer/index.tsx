import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function RecordsDrawer(props: any) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>
    </>
  );
}

export default RecordsDrawer;
