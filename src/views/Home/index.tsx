import { useContext, useState, useEffect } from 'react';
import { Grid, Box, Text, Title, Button } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

// Local components
import ProjectCard from './components/ProjectCard';
import { BioCollectProjectSearch } from 'types';

const range = (max: number) => (max > 0 ? [...Array(max).keys()] : []);

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

  const paramMax = getNumber('max', 20, params);
  const handleChangeMax = (newMax: number) => {
    setParams({ ...params, max: newMax.toString() });
    if (newMax < paramMax && projectSearch) {
      setProjectSearch({
        ...projectSearch,
        projects: projectSearch.projects.slice(0, newMax),
      });
    }
  };

  return (
    <Box p="lg">
      <Title>Home</Title>
      <Text>This is the home page</Text>
      <Button component={Link} to="/test">
        Test
      </Button>
      <Button onClick={() => handleChangeMax(5)}>Max 5</Button>
      <Button onClick={() => handleChangeMax(10)}>Max 10</Button>
      <Button onClick={() => handleChangeMax(15)}>Max 15</Button>
      <Grid>
        {projectSearch &&
          projectSearch.projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        {range(paramMax - (projectSearch?.projects.length || 0)).map((id) => (
          <ProjectCard key={id} project={null} />
        ))}
      </Grid>
    </Box>
  );
}
