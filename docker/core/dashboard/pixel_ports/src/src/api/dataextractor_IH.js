import pixelConstants from '@/utils/constants' // import class for constants
import request from '@/utils/request_IH'

export function dataExtractor(dataString) {
  return request({
    url: pixelConstants.URL_PIXEL_DATA_EXTRACTOR_IH + '?split=false',
    method: pixelConstants.METHOD_POST,
    data: dataString,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getETD(field, fromDate, toDate) {
  if (!toDate) {
    toDate = new Date().getTime()
  }

  if (!fromDate) {
    fromDate = toDate - 2592000000
  }

  return request({
    url: pixelConstants.URL_PIXEL_DATA_EXTRACTOR_IH + '?split=false',
    method: pixelConstants.METHOD_POST,
    data: {
      'source': {
        'sourceId': 'FR_BAS_vcall'
      },
      'filters': [
        {
          'fieldName': field,
          'condition': 'greater',
          'value': fromDate
        },
        {
          'fieldName': field,
          'condition': 'lower',
          'value': toDate
        }
      ],
      'timeIntervals': [
        {
          'start': 0,
          'end': new Date().getTime()
        }
      ]
    },
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}
