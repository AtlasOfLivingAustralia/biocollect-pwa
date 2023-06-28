import axios from 'axios';
import {
  BioCollectProject,
  BioCollectProjectSearch,
  BioCollectSurvey,
} from 'types';
import { BioCollectDexie } from '../dexie';

const testSurvey: BioCollectSurvey = {
  surveySiteOption: 'sitecreate',
  previewUrl: '',
  documents: [
    {
      role: 'logo',
      lng: '',
      publiclyViewable: true,
      thirdPartyConsentDeclarationMade: false,
      filesize: 372351,
      type: 'image',
      isPrimaryProjectImage: false,
      url: 'https://biocollect-test.ala.org.au/document/download/2022-08/0_Facebook_NOBURN-UniSC_%281%29.png',
      labels: [],
      lastUpdated: '2022-08-17T05:02:18Z',
      projectActivityId: '70917648-b045-491f-9a54-8f67d21d6d63',
      dateCreated: '2022-08-17T05:02:18Z',
      filename: '0_Facebook_NOBURN-UniSC_(1).png',
      filepath: '2022-08',
      name: 'Facebook_NOBURN-UniSC_(1).png',
      documentId: '72d2fc78-727a-415a-b577-36ba2cbe442f',
      id: '62fc765aae28e90e08d84d99',
      contentType: 'image/png',
      isSciStarter: false,
      lat: '',
      status: 'active',
      thumbnailUrl:
        'https://biocollect-test.ala.org.au/document/download/2022-08/thumb_0_Facebook_NOBURN-UniSC_%281%29.png',
    },
  ],
  publicAccess: true,
  restrictRecordToSites: false,
  containsActivity: true,
  sites: ['bf5a8c88-cdaf-409a-8055-cb25aa5b7b07'],
  downloadFormTemplateUrl:
    '/acsa/proxy/excelOutputTemplate?type=Flying Fox Survey&expandList=true',
  publishProject: 'Yes',
  methodDocUrl: '',
  lastUpdated: '2022-10-05T00:51:48Z',
  spatialAccuracy: 'moderate',
  mapLayersConfig: {
    baseLayers: [
      {
        displayText: 'Satellite',
        code: 'worldimagery',
        isSelected: true,
      },
    ],
    overlays: [
      {
        showPropertyName: false,
        alaName: 'aus1',
        defaultSelected: true,
        inLayerShapeList: true,
        userAccessRestriction: 'anyUser',
        title: 'States and territories',
        changeLayerColour: false,
        boundaryColour: '#fdb863',
        textColour: '',
        fillColour: '',
        alaId: 'cl22',
        layerName: 'aust_states_territories',
        opacity: '0.3',
      },
    ],
  },
  id: '62fc7634ae28e90e08d84d97',
  methodAbstract: '',
  visibility: {
    embargoOption: 'DAYS',
    embargoForDays: 180,
    embargoUntil: '2023-03-24T13:00:00Z',
    alaAdminEnforcedEmbargo: false,
  },
  defaultZoomArea: 'bf5a8c88-cdaf-409a-8055-cb25aa5b7b07',
  dataSharingLicense: 'https://creativecommons.org/licenses/by-nc/3.0/au/',
  dataManagementPolicyDescription:
    'All identifiable and de-identifiable data will be stored securely on a Virtual Private Server (VPS) hosted by a provider approved by the University of the Sunshine Coast.\nThe VPS will be funded through the Commonwealth Simple Grant Agreement, and as a result, all identifiable information will be stored on this server until the grant expires on March 31, 2024. If the project is not refunded from April 2024 onwards, the identifiable information will be deleted, and de-identified data will be moved and stored on secure servers at the University of the Sunshine Coast.\nTo protect organisations against data blackouts and storage failures, data is routinely backed up by the hosting service provider. This reduces the chance of participants and the research team losing data or experiencing any disruptions.\nAll de-identified data collected by the research team will be kept indefinitely as the data would be impossible to reproduce. The data will be used for the purposes of the project and for future research (including case study analyses) in accordance with sections 601.2/C124 and 601.2/C125 of the Queensland State Archives University Sector Retention and Disposal Schedule.',
  published: true,
  submissionRecords: [],
  dataAccessMethods: [],
  projectActivityId: '70917648-b045-491f-9a54-8f67d21d6d63',
  name: 'NOBURN Data Recording',
  nonTaxonomicAccuracy: 'low',
  allowAdditionalSurveySites: false,
  projectId: 'd8865842-c231-4cc8-aab9-2fbc05c19905',
  startDate: '2021-06-29T14:00:00Z',
  canEditAdminSelectedSites: false,
  status: 'active',
  methodUrl: '',
  description:
    'This is the data recording protocol for the NOBURN project. Please follow the prompts.',
  selectedDocument: '',
  dateCreated: '2022-08-17T05:01:40Z',
  methodType: 'opportunistic',
  isDataManagementPolicyDocumented: true,
  alert: {
    emailAddresses: [],
    allSpecies: [],
  },
  dataQualityAssuranceDescription: '',
  dataAccessExternalURL: '',
  commentsAllowed: false,
  methodDocName: '',
  usageGuide: '',
  speciesFields: [
    {
      dataFieldName: 'species',
      output: 'Flying Fox Survey',
      context: 'speciesSightings',
      label: 'Species name',
      config: {
        type: 'ALL_SPECIES',
        speciesDisplayFormat: 'SCIENTIFICNAME(COMMONNAME)',
      },
    },
  ],
  dataManagementPolicyDocument: '868a7efa-ffaa-4fe1-acaf-25bedaae4b0d',
  dataQualityAssuranceMethods: [
    'dataownercurated',
    'systemsupported',
    'subjectexpertverification',
    'recordannotation',
  ],
  legalCustodianOrganisation: 'University of the Sunshine Coast',
  methodName: 'Opportunistic/ad-hoc observation recording',
  relatedDatasets: [],
  allowPolygons: false,
  allowLine: false,
  allowPoints: true,
  dataManagementPolicyURL: '',
  attribution:
    'University of the Sunshine Coast. (2023) NOBURN Data Recording dataset download. Retrieved from https://biocollect.ala.org.au/bioActivity/projectRecords/d8865842-c231-4cc8-aab9-2fbc05c19905. 28/06/2023, 12:07.',
  pActivityFormName: 'Noburn Protocol',
  temporalAccuracy: 'moderate',
  displaySelectedLicence: [],
  speciesIdentification: 'na',
};
const formatProjects = (projects: BioCollectProject[]) =>
  projects.map((project) => ({
    ...project,
    name: project.name.trim(),
    surveys: [testSurvey],
  }));

const formatProjectSearch = (search: BioCollectProjectSearch) => ({
  ...search,
  projects: formatProjects(search.projects),
});

// type BioCollectProjectSort =
//   | 'dateCreatedSort'
//   | 'nameSort'
//   | '_score'
//   | 'organisationSort';

export default (db: BioCollectDexie) => ({
  projectSearch: async (
    offset = 0,
    max = 30,
    sort: string = 'dateCreatedSort',
    isUserPage = false,
    search?: string,
    geoSearchJSON?: object
  ): Promise<BioCollectProjectSearch> => {
    if (navigator.onLine) {
      // Define basic query parameters
      const params: { [key: string]: any } = {
        fq: 'isExternal:F',
        initiator: 'biocollect',
        sort,
        mobile: true,
        max,
        offset,
        isUserPage,
      };

      // Append user search
      if (search && search.length > 0) params['q'] = search;

      // Append GeoJSON search
      if (geoSearchJSON)
        params['geoSearchJSON'] = JSON.stringify(geoSearchJSON);

      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
        { params }
      );
      const formatted = formatProjectSearch(data);

      // Store the projects in IDB & return
      await db.projects.bulkPut(formatted.projects);
      return formatted;
    } else {
      const projects = await db.projects.offset(offset).limit(max).toArray();

      return {
        facets: [],
        total: await db.projects.count(),
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
      const { data } = await axios.get<BioCollectSurvey[]>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/survey/list/${projectId}`
      );

      console.log(JSON.stringify(data, null, 2));

      await db.surveys.bulkPut(data);

      return data;
    } else {
      return await db.surveys.where('projectId').equals(projectId).toArray();
    }
  },
});
