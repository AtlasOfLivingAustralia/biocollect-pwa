import { Text, Title, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Title>Home</Title>
      <Text>This is the home page</Text>
      <Button component={Link} to="/test">
        Test
      </Button>
    </>
  );
}
