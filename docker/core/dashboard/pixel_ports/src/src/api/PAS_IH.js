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
