import { useContext, useEffect } from 'react';
import { Text, Title, Button } from '@mantine/core';
import { APIContext } from 'helpers/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const api = useContext(APIContext);

  // useEffect(() => {
  //   async function performRequest() {
  //     try {
  //       const data = await api.biocollect.projectSearch();
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   performRequest();
  // }, []);

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
