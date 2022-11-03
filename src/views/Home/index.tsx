import { useContext, useState, useEffect } from 'react';
import { Text, Title, Button } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

// Local components
import ProjectCard from './components';
import { BioCollectProjectSearch } from 'types';

export default function Home() {
  const [projectSearch, setProjectSearch] =
    useState<BioCollectProjectSearch | null>(null);
  const [params, setParams] = useSearchParams();

  // API Context
  const api = useContext(APIContext);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await api.biocollect.projectSearch(
          getNumber('offset', 0, params),
          getNumber('max', 20, params),
          getBool('isUserPage', false, params),
          getString('search', undefined, params)
        );
        setProjectSearch(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjects();
  }, [params]);

  return (
    <>
      <Title>Home</Title>
      <Text>This is the home page</Text>
      <Button component={Link} to="/test">
        Test
      </Button>
      <Button onClick={() => setParams({ ...params, max: '40' })}>
        Max 40
      </Button>
      {projectSearch
        ? projectSearch.projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))
        : [1, 2, 3, 4, 5].map((id) => <ProjectCard key={id} project={null} />)}
    </>
  );
}
