export default {
  route: {
    widget: 'Views',
    overview: 'Overview',
    map: 'Map',
    user: 'Users',
    alerts: 'Alerts',
    operationaltools: 'Operational Tools',
    models: 'Models',
    predictiveAlgorithm: 'Predictive Algorithms',
    kpis: 'KPIs',
    bottleneck: 'Bottleneck',
    event: 'Event Detection',
    trends: 'Trends',
    pattern: 'Pattern',
    anomaly: 'Anomaly',
    publish: 'Publish',
    discovery: 'Discovery',
    schedule: 'Schedule',
    execute: 'Execute',
    orchestrate: 'Orchestrate',
    operational: 'Operational',
    environmental: 'Environmental',
    landside: 'Landside',
    seaside: 'Seaside',
    trigger: 'Trigger',
    visualization: 'Visualization',
    regression: 'Regression',
    alarm: 'Alarm',
    dashboard: 'Dashboard',
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    rolePermission: 'Role Permission',
    directivePermission: 'Directive Permission',
    components: 'Components',
    profile: 'Profile',
    executionListModels: 'Models Execution List',
    executionListPAlgorithm: 'Predictive algorithms Execution List',
    scheduledExecutionList: 'Models Scheduled Executions List',
    viewModelExecution: 'View Model Execution',
    deleteExecution: 'Delete execution',
    newModelExecution: 'New Model Execution',
    newExecution: 'New Execution',
    viewScheduledExecution: 'View Scheduled Execution',
    editScheduledExecution: 'Edit scheduled execution',
    pAlgorithmscheduledExecutionList: 'Predictive algorithm Scheduled Executions List',
    peiDashboard: 'PEI dashboard',
    energyDashboard: 'Energy consumption dashboard',
    trafficDashboard: 'Traffic Prediction Dashboard',
    alertList: 'List',
    myAlerts: 'My Alerts',
    pasForm: 'PAS Information',
    rules: 'Rules',
    resources: 'Resources',
    supplyChain: 'Supplier Chain',
    rulesList: 'Rule Details',
    resourcesList: 'Resource Details',
    supplyChainList: 'Supplier Chain Details'
  },
  specialViews: {
    PEIValue: 'PEI value',
    TechnicalReliability: 'Technical Reliability',
    PEIsubindices: 'PEI subindices',
    ByShip: 'By ship',
    BySupplyChain: 'By supply chain',
    vesselOperations: 'Vessel Operations',
    lowCongestion: 'Low Congestion',
    mediumCongestion: 'Medium Congestion',
    highCongestion: 'High Congestion'
  },
  newExecution: {
    cancel: 'Cancel',
    saveExecution: 'Save Execution'
  },
  navbar: {
    dashboard: 'Dashboard',
    logOut: 'Log Out',
    profile: 'Profile',
    size: 'Global Size',
    lang: 'Change language'
  },
  executionsList: {
    viewResult: 'View',
    deleteExecution: 'Delete execution',
    name: 'Name',
    date: 'Date',
    status: 'Status',
    actions: 'Actions',
    noExecutionsAvailable: 'No executions available',
    back: 'Back',
    addNewExecution: 'Add execution',
    errOperationRequired: 'Operation is required',
    startDate: 'Start date',
    logging: 'Logging',
    input: 'Input',
    output: 'Output',
    fieldMandatory: 'Required field'
  },
  scheduledExecutionsList: {
    noScheduledExecutionsAvailable: 'No scheduled executions available',
    name: 'Name',
    lastExecution: 'Last execution',
    lastStatus: 'Last status',
    actions: 'Actions',
    editScheduledExecution: 'Edit scheduled execution',
    viewScheduledExecution: 'View scheduled execution',
    deleteScheduledExecution: 'Do you want to delete the scheduled execution?',
    back: 'Back',
    save: 'Save changes',
    unit: 'Unit:',
    selectUnit: 'Select unit',
    inputDatasources: 'Input datasources:',
    frequency: 'Frequency:',
    date: 'Date:',
    time: 'Time:',
    value: 'Value:',
    errUnitRequired: 'Unit is required',
    errValueRequired: 'Value is required',
    chooseDate: 'Pick a day',
    chooseTime: 'Choose a time',
    viewExecution: 'View Execution',
    errTimeRequired: 'Time is required',
    errDateRequired: 'Date is required',
    addNewScheduleExecution: 'Add new schedule',
    createScheduledExecution: 'Create new Scheduled Instance',
    startDate: 'Start date:',
    startTime: 'Start time:',
    endDate: 'End date:',
    endTime: 'End time:',
    scheduledInfo: 'Scheduled Info',
    selectValue: 'Select value',
    startDateRequired: 'Start date required',
    startTimeRequired: 'Start time required',
    exportDone: 'Export done. Result:'
  },
  map: {
    close: 'Close',
    infoStation: 'Station Info',
    name: 'Name: ',
    longitude: 'Longitude: ',
    latitude: 'Latitude: ',
    dataSampling: 'Data Sampling: ',
    titleLegend: 'Sensor Type',
    cancel: 'Cancel',
    searchPlaceHolder: 'Search...',
    searchTextErr: 'Location Not Found',
    completeSerie: 'Complete serie',
    observed: 'Observed',
    water_height: 'Water height',
    water_trend: 'Water trend',
    subtitleTideLevel: 'Evolution of tide level',
    subtitleEfficiency: '% Efficiency',
    lastValue: 'Last value: ',
    waterTrend: 'Trend: '
  },
  models: {
    id: 'ID',
    name: 'Name:',
    category: 'Category:',
    author: 'Author:',
    creation: 'Creation',
    ports: 'Ports:',
    schedulable: 'Schedulable',
    actions: 'Actions',
    emptyModels: 'No models available',
    addNewModel: 'Add model',
    orchestrateModels: 'Orchestrate models',
    modelName: 'Model name',
    selectCategory: 'Select a Category',
    description: 'Description:',
    selectPorts: 'Select Port',
    license: 'License:',
    serviceURL: 'Service URL:',
    inputFormat: 'Input Format:',
    cpu: 'CPU:',
    dockerImage: 'Docker image URL:',
    outputFormat: 'Output format:',
    ram: 'RAM:',
    inputURL: 'Input URL:',
    status: 'Status',
    search: 'Search',
    editModel: 'Edit',
    deleteModel: 'Delete',
    runModel: 'Run',
    scheduleModel: 'Schedule',
    createModel: 'Create model',
    errNameRequired: 'Name is required',
    errCategoryRequired: 'Category is required',
    errAuthorRequired: 'Author is required',
    errDescriptionRequired: 'Description is required',
    errLicenseRequired: 'License is required',
    errServiceUrlRequired: 'Service Url is required',
    errDockerImageRequired: 'Docker image url is required',
    errDashboardNameRequired: 'Dashboard url is required',
    errinputFormatRequired: 'Input Format is required',
    erroutputFormatRequired: 'Output Format is required',
    errCpuRequired: 'CPU is required',
    errRamRequired: 'RAM is required',
    inputDataSources: 'Input datasources:',
    errInputDatasourceRequired: 'Input datasource is required',
    serviceDescription: 'Service description:',
    formats: 'Formats:',
    requirements: 'Requirements:',
    type: 'Type:',
    errTypeRequired: 'Type is required',
    categoryEnergy: 'Energy',
    categoryEnvironmental: 'Environmental',
    categoryTraffic: 'Traffic',
    deleted: 'Deleted',
    running: 'Running',
    error: 'Error',
    success: 'Success',
    dashboardUrl: 'Dashboard url:',
    errPortRequired: 'Port is required',
    created: 'Created',
    otDashboardID: 'OT Dashboard ID',
    addInputDataSource: ' Add input datasource',
    datasourceCreated: 'Datasource created',
    selectAddDataSource: 'Select / Add a Datasource',
    addNewInput: 'Add new input datasource',
    selectCPU: 'Select CPU',
    selectRAM: 'Select RAM',
    selectType: 'Select Type',
    selectUnit: 'Select Unit',
    nameTitle: 'Name',
    categoryTitle: 'Category',
    authorTitle: 'Author',
    portsTitle: 'Ports',
    viewDashboard: 'View dashboard',
    deployed: 'Deployed',
    editExecution: 'Edit execution',
    idRef: 'ID Ref.:',
    inputEndpoint: 'Input Endpoint',
    URL: 'URL',
    createExecution: 'Add execution',
    input: 'Input:',
    errInputTypeRequired: 'Input is required',
    selectInput: 'Select input',
    errUrlRequired: 'URL is required',
    forceInput: 'Force input:',
    errForceInputRequired: 'Force input is required',
    headers: 'Headers:',
    addNewHeader: 'Add header',
    errHeadersRequired: 'Header is required',
    selectAddHeader: 'Select / Add a Header',
    addHeader: 'Add Header',
    key: 'Key:',
    value: 'Value:',
    errKeyRequired: 'Key is required',
    errValueRequired: 'Value is required',
    headerCreated: 'Header created',
    operation: 'Operation:',
    selectOperation: 'Select Operation',
    postProcess: 'Postprocess:',
    dockerName: 'Docker name',
    label: 'Label',
    finished: 'Finished',
    errDockerNameRequired: 'Docker name is required',
    errLabelRequired: 'Label is required',
    searchModel: 'Search Model',
    searchExecution: 'Search Execution',
    searchScheduledExecution: 'Search Scheduled Execution',
    editModelDialog: 'Edit Model',
    stopModel: 'Pause',
    playModel: 'Play',
    stopped: 'Stopped',
    privateRepository: 'Private Repository',
    user: 'User',
    password: 'Password',
    errUsernameRequired: 'Username is required',
    errPasswordRequired: 'Password is required'
  },
  pAlgorithm: {
    lastTrained: 'Last trained',
    addPAlgorithm: 'Add predictive algorithm',
    editPAlgorithmDialog: 'Edit predictive algorithm',
    schedulePAlgorithm: 'Schedule predictive algorithm',
    deletePAlgorithm: 'Delete predictive algorithm',
    runPAlgorithm: 'Run predictive algorithm',
    addNewPAlgorithm: 'Add Predictive Algorithm',
    trainPAlgorithm: 'Train predictive algorithm',
    searchPAlgorithm: 'Search Predictive Algorithm',
    emptyPAlgorithm: 'No Predictive Algorithms available',
    createPAlgorithm: 'Create Predictive algorithm'
  },
  kpi: {
    environmental: 'ENVIRONMENTAL',
    operational: 'OPERATIONAL',
    emptyKPIs: 'No KPIs available',
    addNewKPI: 'Add KPI',
    lastUpdated: 'Last updated',
    frequency: 'Frequency',
    thresholds: 'Thresholds',
    monitorActive: 'Monitor active',
    subcategory: 'Subcategory',
    shortDescription: 'Short description',
    longDescription: 'Long description',
    serviceUrl: 'Service url',
    units: 'Units',
    lowerThreshold: 'Lower threshold:',
    upperThreshold: 'Upper threshold:',
    editKPI: 'Edit KPI',
    createKPI: 'Create KPI',
    deleteKPI: 'Delete KPI',
    categoryEnvironmental: 'Environmental',
    categoryOperational: 'Operational',
    errSubCategoryRequired: 'Subcategory is required',
    errShortDescriptionRequired: 'Short description is required',
    errLongDescriptionRequired: 'Long description is required',
    errServiceUrlRequired: 'Service Url is required',
    errUnitsRequired: 'Units is required',
    errLowerThresRequired: 'Lower threshold is required',
    errUpperThresRequired: 'Upper threshold is required',
    errmonitorRequired: 'Monitor active is required',
    errFrequencyRequired: 'Frequency is required',
    kpiName: 'KPI name',
    searchKPI: 'Search KPI',
    indexRef: 'Index Ref.:',
    index_Ref: 'Index Ref.',
    idRef: 'ID Ref.',
    errIndexRefRequired: 'Index Ref. is required',
    errIDRefRequired: 'ID Ref is required',
    showDetails: 'Show details',
    showTrends: 'Show Trends',
    trendsRelatedToKPI: 'Trends related to KPI: ',
    infoRelatedToKPI: 'Details related to KPI: ',
    calculationFrequency: 'Calculation frequency: ',
    lastValue: 'Last value: ',
    calculationPeriod: 'Calculation period',
    periodFrom: 'From: ',
    periodTo: 'To: ',
    minValue: 'Minimun value: ',
    maxValue: 'Maximun value: ',
    averageValue: 'Average value: '
  },
  trends: {
    singleGraph: 'Single graph',
    multipleGraph: 'Multiple graphs',
    options: 'Options:',
    selectKPIs: 'Select a KPI',
    noKPIAvailable: 'No KPIs available'
  },
  event: {
    rules: 'RULES',
    historic: 'HISTORIC',
    addNewRule: 'Add rule',
    emptyRules: 'No Rules available',
    rule: 'Rule',
    createEvent: 'Create event',
    deleteEvent: 'Delete event',
    editEvent: 'Edit Event',
    category: 'Category',
    priority: 'Priority',
    errPriorityRequired: 'Priority is required'
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    btnExportToIH: 'Export to IH',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    removeModel: 'Confirm to remove the model?',
    warning: 'Warning',
    deleteSucced: 'Delete successful!',
    closeDialog: 'Are you sure to close this dialog?',
    ok: 'Ok',
    deleteKPI: 'Delete a KPI',
    removeKPI: 'Do you want to delete the KPI?',
    success: 'Success',
    updateSuccessfull: 'Update Successfully',
    error: 'Error',
    removeEvent: 'Do you want to delete the rule?',
    deleteEvent: 'Delete a rule',
    removeExecutionModel: 'Do you want to delete the execution?',
    deleteModel: 'Delete a model',
    removePAlgorithm: 'Do you want to delete the predictive algorithm',
    deletePAlgorithm: 'Delete a predictive algorithm',
    createdSuccessfully: 'Created Successfully',
    deleteExecutionModel: 'Delete execution Model',
    close: 'Close',
    exportExcel: 'Export Excel',
    dropFile: 'Drop file here or click to select',
    FileNotAllowed: 'File not allowed (only json file)',
    checkBeforeToConfirm: 'Check the fields before to confirm',
    removeResource: 'Confirm to remove the file of resources?',
    deleteResource: 'Delete a file of resources',
    removeRule: 'Confirm to remove the file of rules?',
    deleteRule: 'Delete a file of rules',
    removeSC: 'Confirm to remove the Supply Chain file?',
    deleteSC: 'Delete a Supply Chain file',
    functionalityNotImplemented: 'Functionality not implemented',
    removeArea: 'Confirm to remove the area?',
    deleteArea: 'Delete an Area',
    removeMachine: 'Confirm to remove the machine?',
    deleteMachine: 'Delete Machine',
    removeCargoCategory: 'Confirm to remove the content type?',
    deleteCargoCategory: 'Delete Content Type',
    removeShiftWork: 'Confirm to remove the TimeTable?',
    deleteShiftWork: 'Delete TimeTable',
    removePriorities: 'Confirm to remove all Priorities?',
    deletePriorities: 'Delete Priorities',
    removeValidity: 'Confirm to remove Validity?',
    deleteValidity: 'Delete Validity',
    removeStep: 'Confirm to remove Step?',
    deleteStep: 'Delete Step',
    removeDetail: 'Confirm to remove Details?',
    deleteDetail: 'Delete Details',
    resourceWithEntities: 'This resource file has associated areas or machines. Do you confirm that you want to delete it and the associated entities?',
    ruleWithEntities: 'This rule file has associated entities. Do you confirm that you want to delete both the Rule and the associated entities?',
    SC_WithEntities: 'This Supply Chain file has associated entities. Do you confirm that you want to delete both the Supply Chain and the associated entities?',
    areasNotImplemented: 'No areas available. Please review your object.',
    machinesNotImplemented: 'No machines available. Please review your object.',
    machinesAndAreaNotImplemented: 'No machines or areas available. Please review your object.',
    messageValidation: 'There must be at least one type of consumption',
    stepsNotImplemented: 'No steps available. Please review your object. Row number: ',
    SC_NameNotImplemented: 'No Supplier Chain Name provided. Please review your object. Row number: ',
    stepsAndSC_NameNotImplemented: 'No Step or Supplier Chain Name provided. Please review your object.',
    completeRequiredFields: 'Complete the required fields: Nature, Unit and Value',
    emptyTable: 'No Data available',
    back: 'Back',
    reviewMandatoryFields: 'Review the required fields in the different sections of the form',
    requiredText: ' required',
    available: 'Available',
    selected: 'Selected',
    update: 'Update',
    namePDF: 'What name do you want to put on pdf?',
    cargoCategoryNotImplemented: 'No Content type available. Please review your object',
    shiftWorkNotImplemented: 'No TimeTable available. Please review your object',
    priorityNotImplemented: 'No Priority available. Please review your object',
    ruleNotImplemented: 'Please fill your rule object',
    inputPassword: 'Please input password',
    filter: 'Filter',
    messageNoShiftWork: 'There is no record of TimeTable. To register the machines you must first have timetables registered. Please go to the rules/timetable form.',
    machineRelatedToShiftWork: 'You cannot delete the record. There is a machine related to it: ',
    correctMachineRegister: ' Correct the machine registration first.',
    messageNoMachines: 'There is no record of Machines. To register the Steps you must first have machines registered. Please go to the resources/machine form.',
    machineRelatedToStep: 'You cannot delete the record. There is a Step related to this machine.',
    messageNoCreateCompatibility: 'It is not possible to register a compatibility record. Check that you have registers for: Areas, ContentType and TimeTable.',
    compatibilityRelatedToShiftWork: 'You cannot delete the record. There is a Compatibility register related to this Timetable.',
    compatibilityRelatedToCargoCategory: 'You cannot delete the record. There is a Compatibility register related to this CargoCategory.',
    compatibilityRelatedToAreas: 'You cannnot delete the record. There is a Compatibility register related to this Area.',
    priorityRelatedToCargoCategory: 'You cannot delete the record. There is a Priority register related to this CargoCategory.',
    stepRelatedToStep: 'You cannot delete the record. There is a Step related to this Step',
    mustExistSupplierChain: 'A Supplier Chain must exist in order to register a Content Type. Please, go to Supplier Chain menu and create an empty Supplier Chain.',
    supplierChainRelatedToCargoCategory: 'It is not possible to delete this record. It is related to a Content Type (Rules).',
    lowerLimitBiggerThanUpperLimit: 'The upper limit must be higher than the lower limit.',
    StepNoDelete: 'You cannot delete the record. The Step ',
    stepRelatedForPropertyDuration: ' is related to it in the duration property',
    stepRelatedForPropertyStart: ' is related to it in the start property',
    noCargoCategoriesCreated: 'There are NO Content Type records.',
    deleteBeforeEntitiesRelated: 'It is not possible to delete the entity. You must first delete the records that depend on it and see that the validations / dependencies between objects are maintained.',
    resources: 'RESOURCES',
    rules: 'RULES',
    supplierChain: 'SUPPLIER CHAIN',
    drag: 'Drag',
    noValidNameForArea: 'You can not register the Area with this ID. There is already another record with the same ID.',
    noValidNameForMachine: 'You can not register the Machine with this ID. There is already another record with the same ID.',
    noValidNameForCargoCategory: 'You can not register the Content Type with this ID. There is already another record with the same ID.',
    noValidNameForShiftWork: 'You can not register the Timetable with this ID. There is already another record with the same ID.',
    noValidNameForStep: 'You can not register the Step with this ID. There is already another record with the same ID.'
  },
  login: {
    title: 'Pixel Ports',
    logIn: 'Login',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  user: {
    addUser: 'New User',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  alert: {
    headerButtonAdd: 'Add new rule',
    alertName: 'Name',
    alertActions: 'Actions',
    dialogConfigure: 'Configure',
    dialogSource: 'Select rule',
    buttonPrevius: 'Previus',
    buttonNext: 'Next',
    buttonDone: 'Done',
    listOfAlerts: 'Alerts List',
    myAlerts: 'My Alerts',
    emptyAlerts: 'No Alerts Available',
    alertDescription: 'Description',
    alertTitle: 'Title',
    alertType: 'Type',
    alertSuscriptions: 'Subscription',
    alertRead: 'Read',
    alertFecha: 'Date',
    searchAlert: 'Search Alert'
  },
  widget: {
    pasTitle: 'Model - PAS',
    paTitle: ' Algorithm - PA',
    customTitle: ' Custom',
    pasDescription: 'Uses the PAS/Energy model as a data source',
    paDescription: 'Uses the PA/ETD model as a data source',
    customDescription: 'Allows the use of a customised data source',
    headerModel: 'Search model',
    headerSource: 'Source',
    headerType: 'Type',
    headerButtonSearch: 'Search',
    headerButtonAdd: 'Add',
    listTitle: 'Title',
    listDescription: 'Description',
    listDate: 'Date',
    listSource: 'Source',
    listType: 'Type',
    listStatus: 'Status',
    listActions: 'Actions',
    buttonPublish: 'Publish',
    buttonDraft: 'Draft',
    buttonEdit: 'Edit',
    buttonDelete: 'Delete',
    dialogSource: 'Source',
    dialogType: 'Type',
    dialogConfigure: 'Configure',
    buttonPrevius: 'Previous',
    buttonNext: 'Next',
    buttonDone: 'Add',
    dialogTitle: 'Model',
    emptyWidgets: 'No Visualizations available',
    'real-timeFromSensors': 'Real-time from sensors',
    realTimeDescription: 'Use sensors deployed at Port facilities as data source',
    realTimeExternalSystems: 'Real time from External Systems',
    'real-timeFromExternalSystemsDescription': 'Create visualizations from data coming from external systems',
    Name: 'Name',
    Longitude: 'Longitude',
    Latitude: 'Latitude',
    validateSelectASensor: '* It is necessary to select at least one sensor ',
    name: 'Name',
    water_height: 'Water Height (cm)',
    date: 'Date',
    IMO: 'IMO',
    operation: 'Operation',
    arrival_dock: 'Arrival Dock',
    departure_dock: 'Departure Dock',
    barSimple: 'Bar Simple',
    stepLine: 'Step Line',
    table: 'Table',
    lineChart: 'Line Chart',
    mapGates: 'Map-gates',
    createVisualization: 'Create Visualization',
    updateVisualization: 'Update Visualization',
    selectMandatorySource: '* Please select a source before to select the sensors included in the visualization.',
    selectSource: 'Select Source',
    titleMandatory: 'Title is mandatory. Please fill in.',
    kpiPie: 'KPI Pie (% Efficiency)',
    download: 'Download',
    mapSensor: 'Map with sensors',
    selectMandatorySourceForMapSensor: '* Please select at least one source to show their respective sensors in the Map',
    airDispersionModel: 'Air dispersion Model',
    airDispersionModelDescription: 'Create visualizations on the air dispersion model executions',
    geojsonMap: 'GeoJson Map',
    selectMandatoryExecution: '* Please select a Model Execution.',
    noExecutionAvailable: 'There is No Model Execution Available to chose from.',
    selectExecution: 'Select Model Execution',
    noiseModel: 'Noise Model',
    noiseModelDescription: 'Create visualizations based on the noise model',
    heatMap: 'Heat Map',
    urlMandatory: 'URL is mandatory. Please fill in.',
    trafficModel: 'Traffic Model',
    trafficModelDescription: 'Create visualizations based on the traffic model',
    trafficModelUPV: 'UPV Traffic Model',
    trafficModelDescriptionUPV: 'Create visualizations based on the UPV traffic model',
    selectMandatoryVisualizationType: '* Please select a Visualization type.',
    selectVisualizationType: 'Select Visualization Type',
    maximize: 'Maximize',
    max_flow: 'Max Flow',
    unexpected_flow: 'Unexpected Flow Impact',
    effective_flow: 'Effective Flow',
    total_expected: 'Total Trucks Expected',
    parking_expected_occupancy: 'Parking Lot Expected Occupancy',
    expected_congestion: 'Expected Congestion',
    rowsAs: 'Show rows as::',
    numOfGates: 'Number of Gates',
    lowerThreshold: 'Lower Threshold',
    upperThreshold: 'Upper Threshold',
    trafficParam: 'Traffic Parameter',
    speed: 'Speed',
    intensity: 'Intensity',
    vehicles: 'vehicles',
    kmh: 'Km/h'
  },
  dashboard: {
    title: 'Title:',
    header: 'Header',
    text: 'Text',
    image: 'Image',
    preview: 'Preview',
    visualization: 'Visualization',
    delete: 'Delete',
    editText: 'Edit text',
    save: 'Save',
    load: 'Load',
    clearLayout: 'Clear Layout',
    editURL: 'Edit URL',
    emptyWidgets: 'No widgets available',
    action: 'Action',
    add: 'Add',
    listVisualizations: 'List of Visualizations',
    iframe: 'Iframe',
    emptyDashboards: 'No dashboards available',
    createNewDashboard: 'Create new dashboard',
    edit: 'Edit',
    createDashboard: 'Create dashboard',
    editDashboard: 'Edit dashboard',
    errTitleRequired: 'Title is required',
    ToolBarHeader: 'Add a  Header for: Charts, Iframes, Widgets, etc. ',
    ToolBarText: 'Add a TextArea to explain the content of other regions.',
    ToolBarImage: 'Add an Image to the dashboard (*.jpg, *.png, etc)',
    ToolBarWidget: 'Add a Widget to the dashboard.',
    ToolBarIframe: 'Add an Iframe to the Dashboard. We can set in the frame a URL from Kibana, Tableau, etc.',
    ToolBarClearLayout: 'Cleans the area of the dashboard.',
    ToolBarSave: 'Save in the database the json from the Dashboard.',
    searchDashboard: 'Search Dashbaord'
  },
  home: {
    info: 'Info'
  },
  area: {
    area: 'Area',
    identification: 'Identification',
    id: 'ID:',
    areaType: 'Area Type:',
    consumption: 'Consumption (kW/h)',
    inUse: 'In Use',
    lights: 'Lights',
    with_sunlight: 'With sunlight:',
    without_sunlight: 'Without sunlight:',
    thermalRegulation: 'Thermal regulation:',
    other: 'Other:',
    notInUse: 'Not In Use',
    suitableCargoType: 'Suitable Cargo Type:',
    comments: 'Comments',
    date: 'Date:',
    time: 'Time:',
    text: 'Text:',
    machine: 'Machine',
    machineType: 'Machine Type:',
    model: 'Model:',
    owner: 'Owner:',
    terminal: 'Terminal:',
    picture: 'Picture',
    specifications: 'Specifications',
    initialization: 'Initialization (min):',
    energy: 'Energy:',
    currentState: 'Current state:',
    start: 'Start:',
    maxConsecutive: 'Max Consecutive:',
    wind: 'Wind (km/h):',
    rainfall: 'Rainfall (mm/h)',
    temperature: 'Temperature (ºC)',
    debitUnits: 'Debit units:',
    debit: 'Debit:',
    consumptionUnits: 'Consumption units:',
    consumptionValue: 'Consumption:',
    dust: 'Dust (kg/t)',
    noise: 'Noise (db)',
    suitableArea: 'Suitable Area:',
    label: 'Label:',
    type: 'Type:',
    group: 'Group:',
    shiftID: 'Shift ID:',
    throughput: 'Throughputs',
    value: 'Value:',
    unit: 'Unit:',
    consumptions: 'Consumptions',
    nature: 'Nature:',
    selectType: 'Select a Type',
    supplierChain: 'Supplier Chain',
    comment: 'Comment:',
    compatibility: 'Compatibility',
    cargoCategory: 'Content Type:',
    directionNature: 'Direction Nature:',
    areaID: 'Area ID:',
    shiftwork_ID: 'Timetable ID:',
    rules: 'Rules',
    cargoCategories: 'Content Type',
    segment: 'Segment:',
    typicalAmountRange: 'Typical Amount Range:',
    assignationPreference: 'Assignation Preference',
    priority: 'Priority:',
    direction: 'Direction:',
    dock_ID: 'Dock ID:',
    supplyChain_ID: 'Supply Chain ID:',
    shiftworks: 'Timetables',
    areas: 'Areas',
    machines: 'Machines',
    general: 'General'
  },
  machine: {
    area: 'Area'
  },
  supplierChain: {
    area: 'Area',
    id: 'Id',
    actions: 'Actions',
    name: 'Name',
    name_: 'Name:',
    SupplierChainName_: 'Supply Chain Name:',
    idStep: 'ID',
    idStep_: 'ID:',
    label: 'Label',
    label_: 'Label:',
    comment: 'Comment',
    comment_: 'Comment:',
    category: 'Category',
    category_: 'Category:',
    description: 'Description',
    description_: 'Description:',
    details: 'Details',
    creation: 'Creation',
    scheduling: 'Scheduling',
    work: 'Work',
    compatibility: 'Compatibility',
    steps: 'Steps',
    start: 'Start',
    cargoes_category: 'Content Type:',
    cargoes_categoryHeader: 'Content Type',
    directions_Nature: 'Directions Nature:',
    directions_NatureHeader: 'Directions Nature',
    areas_ID: 'Areas ID:',
    areas_IDHeader: 'Areas ID',
    shiftworks_ID: 'Timetables ID:',
    shiftworks_IDHeader: 'Timetables ID',
    duration: 'Duration',
    nature: 'Nature',
    nature_: 'Nature:',
    value: 'Value',
    value_: 'Value:',
    distance: 'Distance',
    distance_: 'Distance:',
    machines_: 'Machines:',
    machines: 'Machines',
    selectCategory: 'Select Category',
    selectNature: 'Select Nature',
    selectSteps: 'Select Steps',
    selectMachines: 'Select Machines',
    selectCargoesCategory: 'Select Content Type',
    selectAreas_ID: 'Select Areas ID',
    selectShifworks_ID: 'Select Timetable ID',
    selectdirections_Nature: 'Select Direction Nature',
    create_SC: 'Create Supply Chain',
    createStep: 'Create Step',
    editStep: 'Edit Step',
    createDetail: 'Create Detail',
    editDetail: 'Edit Detail',
    createCompatibility: 'Create Compatibility',
    editCompatibility: 'Edit Compatibility',
    errSC_NameRequired: 'Supply Chain Name is required',
    errStepIDRequired: 'Step Name is required',
    errStepLabelRequired: 'Step Label is required',
    errStepNatureRequired: 'Nature is required',
    errStepValueRequired: 'Value is required',
    errStepMachinesRequired: 'Machines is required',
    btnAddStep: 'Add Step',
    btnAddNewSupplierChain: 'Add Supplier Chain',
    btnAddNewDetails: 'Add Details',
    btnAddNewCompatibility: 'Add Compatibility',
    detailsHeader: 'DETAILS',
    stepsHeader: 'STEPS',
    compatibilityHeader: 'COMPATIBILITY',
    contentTypeHeader: 'Content Type',
    contentType: 'Content Type:',
    selectContentType: 'Select Content Type'
  },
  rules: {
    btnAddNewRule: 'Add Rule',
    btnAddPriority: 'Add Priority',
    btnAddValidity: 'Add Validity',
    btnAddAssignment: 'Add Assignment',
    btnAddShiftWork: 'Add Timetable',
    btnAddCargoCategory: 'Add Content Type',
    search: 'search',
    ruleName: 'Name',
    description: 'Description',
    description_: 'Description:',
    creation: 'Creation',
    actions: 'Actions',
    createRule: 'Create Rule',
    name: 'Name',
    name_: 'Name:',
    cargo_category: 'Content Type',
    shiftwork: 'Timetable',
    priority: 'Priority',
    priority_: 'Priority:',
    priorities: 'Priorities',
    validity: 'Validity',
    assignment: 'Assignment',
    errRuleNameRequired: 'Rule Name is required',
    id: 'ID',
    id_: 'ID:',
    segment: 'Segment',
    segment_: 'Segment:',
    unit: 'Unit',
    unit_: 'Unit:',
    direction: 'Direction',
    direction_: 'Direction:',
    dock_ID: 'Dock ID',
    dock_ID_: 'Dock ID:',
    supplyChainID: 'Supply Chain ID',
    supplyChainID_: 'Supply Chain ID:',
    selectSegment: 'Select Segment',
    selectDirection: 'Select Direction',
    createCargoesCategory: 'Create Content Type',
    createShiftWork: 'Create Timetable',
    editCargoesCategory: 'Edit Content Type',
    editShiftWork: 'Edit Timetable',
    choosePriorities: 'Choose Priorities',
    addPriority: 'Add Priority',
    addValidity: 'Add Validity',
    errIDRequired: 'ID is required',
    errSegmentRequired: 'Segment is required',
    errUnitRequired: 'Unit is required',
    errLowerLimitRequired: 'Lower Limit is required',
    errUpperLimitRequired: 'Upper Limit is required',
    errUpperLimitHigher: 'Upper Limit must be higher than Lower',
    errPreferenceRequired: 'Preference is required',
    errPriorityRequired: 'Priority is required',
    errDirectionRequired: 'Direction is required',
    errDockIDRequired: 'Dock ID is required',
    errSupplyChainIDRequired: 'Supply Chain ID is required',
    errOnePriorityRequired: 'At least one Priority is required ',
    general: 'General',
    typicalRange: 'Range',
    assignationPreference: 'Preference',
    lowerLimit_: 'Lower Limit:',
    upperLimit_: 'Upper Limit:',
    day: 'Day',
    firstHalf: 'First Half',
    secondHalf: 'Second Half',
    start: 'Start',
    end: 'End',
    addPreference: 'add Preference',
    completeRequiredFields: 'Complete the required fields: Priority, Direction, Dock_ID and Supply_Chain_ID',
    messagePreferenceValidation: 'There must be at least one Preference',
    messageDraggable: 'You can drag rows up and down to adjust priorities',
    priorityTaken: 'Priority taken. Please choose another number',
    messagePriorityValidation: 'There is an issue with the Priority. The Priority field in the list must start from 0 and increase consecutively. Please modify accordingly.',
    cargo_categoryHeader: 'CONTENT TYPE',
    shiftworkHeader: 'TIMETABLE',
    priorityHeader: 'PRIORITY',
    contentType_Header: 'CONTENT TYPES',
    btnAddContentType: 'Add Content Type',
    vesselPriorityHeader: 'VESSEL PRIORITY',
    btnAddVesselPriority: 'Add Vessel Priority',
    createContentType: 'Create Content Type',
    editContentType: 'Edit Content Type',
    chooseVesselPriorities: 'Choose Vessel Priorities'
  },
  resources: {
    emptyTable: 'No Data available',
    addNewResource: 'Add Resource',
    errFileNameRequired: 'FileName is required',
    search: 'Search',
    fileName: 'Name',
    description: 'Description',
    creation: 'Creation',
    actions: 'Actions',
    // btnExportToIH: 'Export to IH',
    // btnEdit: 'Edit',
    // btnDelete: 'Delete',
    back: 'Back',
    area: 'AREA',
    machine: 'MACHINE',
    addArea: 'Add Area',
    addMachine: 'Add Machine',
    errIDRequired: 'ID is required',
    errMondayRequired: 'Monday hours are required',
    name: 'Name:',
    createResource: 'Create Resource',
    id: 'ID',
    label: 'Label',
    type: 'Type',
    owner: 'Owner',
    terminal: 'Terminal',
    editArea: 'Edit Area',
    editMachine: 'Edit Machine',
    createArea: 'Create Area',
    createMachine: 'Create Machine',
    group: 'Group',
    errNatureRequired: 'Nature is required',
    addConsumption: 'Add Consumption',
    update: 'Update',
    downloadPDF: 'Download PDF',
    elasticIndex: 'Index name'
  }
}
