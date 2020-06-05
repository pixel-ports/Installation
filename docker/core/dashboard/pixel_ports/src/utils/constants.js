// Define the constants needs for PIXEL
export default {
  baseURL_PIXEL_DATAMODEL_API: 'https://api-ot.demo.pixel-ports.eu', // sin OpenVPN
  // baseURL_PIXEL_DATAMODEL_API: 'http://192.168.0.30:8080/otpixel/api', // con OpenVPN
  APP_BASE_DATA_API_PAS: 'https://elasticsearch-proxy.pixel-ports.eu',
  // APP_BASE_DATA_API_PAS: 'http://192.168.0.3:8200/ih-api',
  // methods petition API
  METHOD_HEAD: 'HEAD',
  METHOD_GET: 'GET',
  METHOD_POST: 'POST',
  METHOD_PUT: 'PUT',
  METHOD_DELETE: 'DELETE',
  // API KEY SWAGGER UPV (PIXEL DATAMODEL API)
  API_KEY_SWAGGER_PIXEL_DATAMODEL: 'ApiKey p1x3l',
  // url different methods for OTools API (Models)
  URL_PIXEL_GET_MODELS: 'models/list',
  URL_PIXEL_GET_MODEL: 'models/get/',
  URL_PIXEL_ADD_MODEL: 'models/create',
  URL_PIXEL_UPDATE_MODEL: 'models/update',
  URL_PIXEL_REMOVE_MODEL: 'models/delete/',
  // url different methods for OTools API (KPIs)
  URL_PIXEL_GET_KPIs: 'kpis/list',
  URL_PIXEL_GET_KPI: 'kpis/get/',
  URL_PIXEL_ADD_KPI: 'kpis/create',
  URL_PIXEL_UPDATE_KPI: 'kpis/update',
  URL_PIXEL_REMOVE_KPI: 'kpis/delete/',
  // url different methods for OTools API (Predictive Algorithms)
  URL_PIXEL_GET_PREDICTIVE_ALGORITHMS: 'predictiveAlgorithms/list',
  URL_PIXEL_GET_PREDICTIVE_ALGORITHM: 'predictiveAlgorithms/get/',
  URL_PIXEL_ADD_PREDICTIVE_ALGORITHM: 'predictiveAlgorithms/create',
  URL_PIXEL_UPDATE_PREDICTIVE_ALGORITHM: 'predictiveAlgorithms/update',
  URL_PIXEL_REMOVE_PREDICTIVE_ALGORITHM: 'predictiveAlgorithms/delete/',
  // url different methods for OTools API (Event Log Item)
  URL_PIXEL_GET_EVENTS: 'eventLogItem/list',
  URL_PIXEL_GET_EVENT: 'eventLogItem/get/',
  URL_PIXEL_ADD_EVENT: 'eventLogItem/create',
  URL_PIXEL_UPDATE_EVENT: 'eventLogItem/update',
  URL_PIXEL_REMOVE_EVENT: 'eventLogItem/delete/',
  // url different methods for OTools API (Instance Resource)
  URL_PIXEL_GET_INSTANCES: 'instances/list',
  URL_PIXEL_GET_INSTANCE: 'instances/get/',
  URL_PIXEL_ADD_INSTANCE: 'instances/create',
  URL_PIXEL_UPDATE_INSTANCE: 'instances/update',
  URL_PIXEL_REMOVE_INSTANCE: 'instances/delete/',
  // url different methods for OTools API (Scheduled Instance Resource)
  URL_PIXEL_GET_SCHEDULED_INSTANCES: 'scheduledInstances/list',
  URL_PIXEL_GET_SCHEDULED_INSTANCE: 'scheduledInstances/get/',
  URL_PIXEL_ADD_SCHEDULED_INSTANCE: 'scheduledInstances/create',
  URL_PIXEL_UPDATE_SCHEDULED_INSTANCE: 'scheduledInstances/update',
  URL_PIXEL_REMOVE_SCHEDULED_INSTANCE: 'scheduledInstances/delete/',
  URL_PIXEL_UPDATE_STATUS_SCHEDULED_INSTANCE: 'scheduledInstances/updateStatus/',
  // url different methods for IH API (dataExtractor)
  URL_PIXEL_DATA_EXTRACTOR_IH: 'archivingSystem/extractor/v1/data',
  // attributes for OTools petition
  Content_Type_Application_Json: 'application/json',
  // Type of message for Modal Dialog
  SUCCESS_MESSAGE_TYPE: 'success',
  WARNING_MESSAGE_TYPE: 'warning',
  ERROR_MESSAGE_TYPE: 'error',
  // constants for models and predictive algorithms
  RAMs: [
    { label: '1 GB', value: '1GB' },
    { label: '2 GB', value: '2GB' },
    { label: '4 GB', value: '4GB' },
    { label: '8 GB', value: '8GB' },
    { label: '16 GB', value: '16GB' },
    { label: '32 GB', value: '32GB' }
  ],
  CPUs: [
    { label: '1 vCPU', value: '1VCPU' },
    { label: '2 vCPU', value: '2VCPU' },
    { label: '4 vCPU', value: '4VCPU' },
    { label: '8 vCPU', value: '8VCPU' }
  ],
  Dates: [
    { label: '$(DATE_current) => Current date', value: '$(DATE_current)' },
    { label: '$(DATE_DAY_init) => Date of the first second of the current day', value: '$(DATE_DAY_init)' },
    { label: '$(DATE_DAY_last) => Date of the last second of the current day', value: '$(DATE_DAY_last)' },
    { label: '$(DATE_WEEK_init) => Date of the first second of the current week', value: '$(DATE_WEEK_init)' },
    { label: '$(DATE_WEEK_last) => Date of the last second of the current week', value: '$(DATE_WEEK_last)' }
  ],
  Ports: [
    { label: 'Port of Thessaloniki', value: 'GRSKG' },
    { label: 'Port of Piraeus', value: 'GRPIR' },
    { label: 'Grand Port Maritime of Bordeaux', value: 'FRBOD' },
    { label: 'Port of Monfalcone', value: 'ITMNF' },
    { label: 'Port of SDAG', value: 'ITGZA' }
  ],
  types: [
    { label: 'Real time', value: 'rt' },
    { label: 'Not real time', value: 'nort' }
  ],
  timeUnits: [
    { label: 'Second', value: 'second' },
    { label: 'Minute', value: 'minute' },
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ],
  inputsExecution: [
    { label: 'Force Input', value: 'forceInput' },
    { label: 'Input Endpoint', value: 'inputEndpoint' }
  ],
  inputsExecutionType: [
    { label: 'Object', value: 'object' },
    { label: 'Array', value: 'array' }
  ],
  inputsOperation: [
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' }
  ],
  // type of Models
  TYPE_MODEL: 'model',
  TYPE_PREDICTIVE_ALGORITHM: 'pa'
}
