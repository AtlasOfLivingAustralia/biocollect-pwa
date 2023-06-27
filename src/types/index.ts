/* eslint-disable @typescript-eslint/no-explicit-any */
/*
	General API
*/
export interface Facet {
  entries: string[] | null;
  helpText: string;
  name: string;
  ranges: string | null;
  state: string;
  terms: string[];
  title: string;
  total: number;
  type: string;
}

/*
	BioCollect API
*/
export interface BioCollectProject {
  projectId: string;
  aim: string;
  coverage: {
    datum: string;
    fid: string;
    other: string[];
    precision: string;
    lga: string[];
    bbox: string;
    aream2: number;
    decimalLatitude: number;
    pid: number;
    uncertainty: string;
    type: string;
    elect: string[];
    cmz: string[];
    state: string[];
    radius: number;
    mvg: string;
    areaKmSq: number;
    nrm: string[];
    locality: string;
    decimalLongitude: number;
    centre: string[];
    mvs: string;
    name: string;
    imcra4_pb: string[];
    ibra: string[];
    layerName: string;
  };
  description: string;
  difficulty: string | null;
  endDate: string | null;
  isExternal: false;
  isSciStarter: false;
  keywords: string[] | null;
  links: string[];
  name: string;
  organisationId: string;
  organisationName: string;
  scienceType: string[];
  ecoScienceType: string[];
  startDate: string;
  urlImage: string | null;
  fullSizeImageUrl: string | null;
  urlWeb: string | null;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  projectType: string;
  isMERIT: boolean;
  tags: string[];
  containsActivity: boolean;
  noCost: boolean;
}

export interface BioCollectProjectSearch {
  facets: Facet[];
  projects: BioCollectProject[];
  total: number;
}

export interface BioCollectSurvey {
  surveySiteOption: string;
  previewUrl: string;
  selectFromSitesOnly: boolean;
  documents: any[];
  publicAccess: boolean;
  restrictRecordToSites: boolean;
  downloadFormTemplateUrl: string;
  sites: any[];
  methodDocUrl: string;
  lastUpdated: string;
  spatialAccuracy: string;
  stats: Stats;
  mapLayersConfig: MapLayersConfig;
  id: string;
  methodAbstract: string;
  visibility: Visibility;
  defaultZoomArea: string;
  dataSharingLicense: string;
  dataManagementPolicyDescription: string;
  published: boolean;
  submissionRecords: any[];
  dataAccessMethods: any[];
  version: number;
  projectActivityId: string;
  name: string;
  nonTaxonomicAccuracy: string;
  allowAdditionalSurveySites: boolean;
  projectId: string;
  startDate: string;
  canEditAdminSelectedSites: boolean;
  status: string;
  methodUrl: string;
  description: string;
  selectedDocument: string;
  dateCreated: string;
  isDataManagementPolicyDocumented: boolean;
  methodType: string;
  alert: Alert;
  dataQualityAssuranceDescription: string;
  dataAccessExternalURL: string;
  commentsAllowed: boolean;
  methodDocName: string;
  usageGuide: string;
  speciesFields: SpeciesField[];
  dataManagementPolicyDocument: string;
  dataQualityAssuranceMethods: string[];
  legalCustodianOrganisation: string;
  methodName: string;
  excludeProjectSite: string;
  relatedDatasets: any[];
  addCreatedSiteToListOfSelectedSites: boolean;
  allowPolygons: boolean;
  allowLine: boolean;
  allowPoints: boolean;
  attribution: string;
  dataManagementPolicyURL: string;
  pActivityFormName: string;
  temporalAccuracy: string;
  displaySelectedLicence: any[];
  speciesIdentification: string;
}

export interface Stats {
  activityCount: number;
  activityLastUpdated: string;
  speciesRecorded: number;
  publicAccess: boolean;
}

export interface MapLayersConfig {
  delete: 'me';
}

export interface Visibility {
  embargoOption: string;
  alaAdminEnforcedEmbargo: boolean;
}

export interface Alert {
  emailAddresses: string[];
  allSpecies: AllSpecy[];
}

export interface AllSpecy {
  listId: string;
  commonName: string;
  outputSpeciesId: string;
  scientificName: string;
  name: string;
  guid: string;
}

export interface SpeciesField {
  dataFieldName: string;
  output: string;
  context: string;
  label: string;
  config: Config;
}

export interface Config {
  scientificNameField: string;
  speciesLists: SpeciesList[];
  speciesOptions: SpeciesOption[];
  groupInfoVisible: boolean;
  commonNameField: string;
  singleInfoVisible: boolean;
  allSpeciesInfoVisible: boolean;
  type: string;
  speciesDisplayFormat: string;
  newSpeciesLists: NewSpeciesLists;
  singleSpecies: SingleSpecies;
  allSpeciesLists: AllSpeciesLists;
  commonFields: string[];
}

export interface SpeciesList {
  dataResourceUid: string;
  fullName: string;
  listName: string;
  listType: string;
  itemCount: string;
}

export interface SpeciesOption {
  name: string;
  id: string;
}

export interface NewSpeciesLists {
  inputSpeciesViewModel: InputSpeciesViewModel;
  dataResourceUid: string;
  allSpecies: any[];
  description: string;
  listName: string;
  listType: string;
}

export interface InputSpeciesViewModel {
  listId: string;
  commonName: string;
  outputSpeciesId: string;
  scientificName: string;
  name: string;
  guid: string;
}

export interface SingleSpecies {
  listId: string;
  commonName: string;
  outputSpeciesId: string;
  scientificName: string;
  name: string;
  guid: string;
}

export interface AllSpeciesLists {
  searchGuid: string;
  pagination: Pagination;
  offset: number;
  descIconClass: string;
  allSpeciesListsToSelect: any[];
  searchName: string;
  ascIconClass: string;
  listCount: string;
}

export interface Pagination {
  totalResults: string;
  resultsPerPage: number;
  start: string;
  showPagination: boolean;
  rppOptions: number[];
  currentPage: string;
  info: string;
}
