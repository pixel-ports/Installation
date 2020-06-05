import pixelConstants from '@/utils/constants' // import class for constants
import request from '@/utils/request_otools'

// #region Models

export function getModelsByType(type) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_MODELS + '?type=' + type,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getModels(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_MODELS,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getModel(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_MODEL + query.id,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function addModel(data) {
  return request({
    url: pixelConstants.URL_PIXEL_ADD_MODEL,
    method: pixelConstants.METHOD_PUT,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateModel(data) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_MODEL,
    method: pixelConstants.METHOD_POST,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function removeModel(query) {
  return request({
    url: pixelConstants.URL_PIXEL_REMOVE_MODEL + query.id,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

// #endregion

// #region KPIs

export function getKPIs(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_KPIs + '?category=' + query.categorySelected,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getKPI(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_KPI + query.id,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function addKPI(data) {
  return request({
    url: pixelConstants.URL_PIXEL_ADD_KPI,
    method: pixelConstants.METHOD_PUT,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateKPI(data) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_KPI,
    method: pixelConstants.METHOD_POST,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function removeKPI(query) {
  return request({
    url: pixelConstants.URL_PIXEL_REMOVE_KPI + query.id,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getKPILastValuesByID(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_KPI + query.id + '/lastKPI',
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getStateKPIByID(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_KPI + query.id + '/stats',
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getStateKPIByID_date(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_KPI + query.id + '/stats?from=' + query.from + '&to=' + query.to,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

// #endregion

// #region Event Detection

export function getEvents(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_EVENTS + '?category=' + query.categorySelected,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getEvent(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_EVENT + query.id,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function addEvent(data) {
  return request({
    url: pixelConstants.URL_PIXEL_ADD_EVENT,
    method: pixelConstants.METHOD_PUT,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateEvent(data) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_EVENT,
    method: pixelConstants.METHOD_POST,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function removeEvent(query) {
  return request({
    url: pixelConstants.URL_PIXEL_REMOVE_EVENT + query.id,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}
// #endregion

// #region Instance Resource

export function getInstancesByIdRef(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_INSTANCES + '?idRef=' + query.refId,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getInstance(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_INSTANCE + query.id,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function addInstance(data) {
  return request({
    url: pixelConstants.URL_PIXEL_ADD_INSTANCE,
    method: pixelConstants.METHOD_PUT,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateInstance(data) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_INSTANCE,
    method: pixelConstants.METHOD_POST,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function removeInstance(query) {
  return request({
    url: pixelConstants.URL_PIXEL_REMOVE_INSTANCE + query.id,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}
// #endregion

// #region Scheduled Instance Resource

export function getScheduledInstancesByIdRef(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_SCHEDULED_INSTANCES + '?idRef=' + query.refId,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function getScheduledInstance(query) {
  return request({
    url: pixelConstants.URL_PIXEL_GET_SCHEDULED_INSTANCE + query.id,
    method: pixelConstants.METHOD_GET,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function addScheduledInstance(data) {
  return request({
    url: pixelConstants.URL_PIXEL_ADD_SCHEDULED_INSTANCE,
    method: pixelConstants.METHOD_PUT,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateScheduledInstance(data) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_SCHEDULED_INSTANCE,
    method: pixelConstants.METHOD_POST,
    data: data,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function removeScheduledInstance(query) {
  return request({
    url: pixelConstants.URL_PIXEL_REMOVE_SCHEDULED_INSTANCE + query.id,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}

export function updateStatusScheduledInstance(query, status) {
  return request({
    url: pixelConstants.URL_PIXEL_UPDATE_STATUS_SCHEDULED_INSTANCE + query.id + '?status=' + status,
    method: pixelConstants.METHOD_POST,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL
    }
  })
}
// #endregion
