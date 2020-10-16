import pixelConstants from '@/utils/constants' // import class for constants
import request from '@/utils/request_IH_PAS'

export function existIndex(indexName) {
  return request({
    url: '/' + indexName,
    method: pixelConstants.METHOD_HEAD,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function deleteIndex(indexName) {
  return request({
    url: '/' + indexName,
    method: pixelConstants.METHOD_DELETE,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function createIndex(indexName) {
  return request({
    url: '/' + indexName,
    method: pixelConstants.METHOD_PUT,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function insertDocument(indexName, dataString) {
  return request({
    url: '/' + indexName + '/_doc',
    method: pixelConstants.METHOD_POST,
    data: dataString,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getIDFromAirDispersionModelExecution() {
  return request({
    url: '/airmodel/_search',
    method: pixelConstants.METHOD_POST,
    data: {
      'query': {
        'match_all': {}
      },
      'stored_fields': []
    },
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getIDFromTrafficModelExecution() {
  return request({
    url: '/trafficmodel/_search',
    method: pixelConstants.METHOD_POST,
    data: {
      'query': {
        'match_all': {}
      },
      'stored_fields': []
    },
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getGeoJSONForAirDispersionModel(fileID) {
  return request({
    url: '/airmodel/_source/' + fileID,
    method: pixelConstants.METHOD_GET,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getTrafficExecutionById(fileID) {
  return request({
    url: '/trafficmodel/_source/' + fileID,
    method: pixelConstants.METHOD_GET,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

/* export function filterSensors(indexName, fromDate, toDate) {
  return request({
    url: '/' + indexName + '/_doc',
    method: pixelConstants.METHOD_POST,
    data: dataString,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}*/
