import pixelConstants from '@/utils/constants' // import class for constants
import request from '@/utils/request_IH'

export function dataExtractor(dataString) {
  return request({
    url: pixelConstants.URL_PIXEL_DATA_EXTRACTOR_IH, // + '?split=false',
    method: pixelConstants.METHOD_POST,
    data: dataString,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function ListSensorByIdSource(idSource) {
  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH + '/query/latestCollapseByField',
    method: pixelConstants.METHOD_POST,
    data: {
      'source': {
        'sourceId': idSource
      },
      'collapseField': 'name',
      'timestampField': 'observed'
    },
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getSourcesFromPort() {
  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH + '/sources',
    method: pixelConstants.METHOD_GET,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getSourceTypesFromPort() {
  // URL_PIXEL_EXTRACTOR_SOURCES_IH
  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH + '/sourceTypes',
    method: pixelConstants.METHOD_GET,
    headers: {
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getSensors(source, operator, filter, fromDate, toDate) {
  if (!toDate) {
    toDate = new Date().getTime()
  }

  if (!fromDate) {
    fromDate = toDate - 2592000000
  }

  var sourceId = source// 'FR_BOD:TideSensor'
  /* switch (typeSensor) {
    case 'TideSensor':
      sourceId = 'FR_BOD_TideSensor'
      break
  }*/
  var dataString =
  {
    'source': {
      'sourceId': sourceId
    },
    'filters': [
      {
        'fieldName': 'name',
        'condition': operator,
        'value': filter
      },
      {
        'fieldName': 'observed',
        'condition': 'greater',
        'value': fromDate
      },
      {
        'fieldName': 'observed',
        'condition': 'lower',
        'value': toDate
      }
    ]/*,
    'timeIntervals': [
      {
        'start': 0,
        'end': 1593554400000
      }
    ]*/
  }
  console.log(dataString)
  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH + '/data', // + '?split=false',
    method: pixelConstants.METHOD_POST,
    data: dataString,
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getLatestValueForEachSensor(source) {
  /* console.log(source[0])
  var sourceId = ''
  if (source.length === 1) {
    sourceId = source[0]
  }*/
  source = 'FR_BOD:TideSensor'
  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH_LATEST_COLLAPSEBYFIELD,
    method: pixelConstants.METHOD_POST,
    data: {
      'source': {
        'sourceId': source
      },
      'collapseField': 'name',
      'timestampField': 'observed'
    },
    headers: {
      Accept: pixelConstants.Content_Type_Application_Json,
      'Content-Type': pixelConstants.Content_Type_Application_Json
    }
  })
}

export function getVesselCallRawData(source, field) {
  /* if (!toDate) {
    toDate = new Date().getTime()
  }

  if (!fromDate) {
    fromDate = toDate - 2592000000
  }*/

  return request({
    url: pixelConstants.URL_PIXEL_EXTRACTOR_SOURCES_IH + '/query/latestCollapseByField',
    method: pixelConstants.METHOD_POST,
    data: {
      'source': {
        'sourceId': source
      },
      'collapseField': 'name',
      'timestampField': field/*,
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
      ]*/
    },
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
        'sourceId': 'FR_BAS:vcall'
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
