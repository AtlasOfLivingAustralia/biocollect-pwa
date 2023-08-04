import axios from 'axios';
import {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  BioCollectProject,
  BioCollectProjectSearch,
  BioCollectSurvey,
  FilterQueries,
} from 'types';
import { BioCollectDexie } from '../dexie';

const escapeRegExp = (input: string) =>
  input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const filterActiveSurveys = (surveys: BioCollectSurvey[]) =>
  surveys.filter(
    ({ startDate, endDate }) =>
      new Date(startDate).getTime() <= Date.now() &&
      (!endDate || new Date(endDate).getTime() >= Date.now())
  );

const formatProjects = (projects: BioCollectProject[]) => {
  return projects.map((project) => ({
    ...project,
    name: project.name.trim(),
    projectActivities: filterActiveSurveys(project.projectActivities),
  }));
};

const formatProjectSearch = (search: BioCollectProjectSearch) => ({
  ...search,
  projects: formatProjects(search.projects),
});

type BioCollectProjectSort =
  | 'dateCreatedSort'
  | 'nameSort'
  | '_score'
  | 'organisationSort';

export default (db: BioCollectDexie) => ({
  projectSearch: async (
    offset = 0,
    max = 30,
    sort: BioCollectProjectSort | string = 'dateCreatedSort',
    isUserPage = false,
    search?: string,
    hasDownloadedSurveys = true
  ): Promise<BioCollectProjectSearch> => {
    if (navigator.onLine) {
      // Define basic query parameters
      const params: { [key: string]: any } = {
        fq: 'isExternal:F',
        // initiator: 'biocollect',
        initiator: 'seed',
        sort,
        mobile: true,
        max,
        offset,
        isUserPage,
      };

      // Append user search
      if (search && search.length > 0) params['q'] = search;

      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
        { params }
      );
      const formatted = await formatProjectSearch(data);

      // Store the projects in IDB & return
      await db.projects.bulkPut(formatted.projects);
      return formatted;
    } else {
      // Fix for WebKit empty DB issue
      // https://github.com/dexie/Dexie.js/issues/1052
      if (hasDownloadedSurveys && (await db.cached.count()) === 0) {
        return {
          facets: [],
          total: 0,
          projects: [],
        };
      }

      // Create the base collection query
      let query = db.projects.toCollection();

      // Append the search query
      if (search && search.length > 0)
        query = query.and(({ name }) =>
          new RegExp(`.*${escapeRegExp(search)}.*`).test(name)
        );

      // Get a list of downloaded surveys
      if (hasDownloadedSurveys) {
        const projectsWithSurveys = await db.cached
          .orderBy('projectId')
          .uniqueKeys();

        query = query.and(({ projectId }) =>
          projectsWithSurveys.includes(projectId)
        );
      }

      // Perform the query
      const projects = await query.offset(offset).limit(max).toArray();

      return {
        facets: [],
        total: await query.count(),
        projects,
      };
    }
  },
  getProject: async (projectId: string): Promise<BioCollectProject | null> => {
    const cached = await db.projects.get(projectId);
    if (cached) {
      return cached;
    } else if (navigator.onLine) {
      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
        {
          params: {
            fq: `projectId:${projectId}`,
          },
        }
      );

      const [project] = formatProjects(data.projects);
      return project;
    }

    return null;
  },

  listSurveys: async (projectId: string): Promise<BioCollectSurvey[]> => {
    if (navigator.onLine) {
      // Make the GET request
      let { data: surveys } = await axios.get<BioCollectSurvey[]>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/survey/list/${projectId}`
      );

      // Filter out non-active surveys (not within date range)
      surveys = filterActiveSurveys(surveys);
      await db.surveys.bulkPut(surveys);

      return surveys;
    } else {
      return await db.surveys.where('projectId').equals(projectId).toArray();
    }
  },

  searchActivities: async (
    view: BioCollectBioActivityView,
    filters?: FilterQueries
  ): Promise<BioCollectBioActivitySearch> => {
    if (navigator.onLine) {
      // Transform the FilterQueries object
      const params = new URLSearchParams({
        view,
        ...(filters || {}),
      });

      // Make the GET request
      const { data } = await axios.get<BioCollectBioActivitySearch>(
        `${
          import.meta.env.VITE_API_BIOCOLLECT
        }/ws/bioactivity/search?${params.toString()}`
      );

      await db.activities.bulkPut(data.activities);

      return data;
    } else {
      return { activities: [] };
    }
  },
});
