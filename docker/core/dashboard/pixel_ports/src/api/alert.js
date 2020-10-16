import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

/* export function alertDashboardFetchList(query) {
  return request({
    url: '/alert/published',
    method: 'get'
  })
}*/

export function alertFetchList() {
  return request({
    url: '/notification/subscription',
    method: 'get'
  })
}

export function alertFetchSubscriptionLog() {
  return request({
    url: '/notification/log',
    method: 'get'
  })
}

// export function alertdCreate(data) {
//   return request({
//     url: '/dashboard',
//     method: 'post',
//     data
//   })
// }

export function alertUpdate(data) {
  return request({
    url: `/notification/subscription`,
    method: 'put',
    data
  })
}

// export function alertDelete(id) {
//   return request({
//     url: `/dashboard/${id}`,
//     method: 'delete'
//   })
// }

// export function alertGet(id) {
//   return request({
//     url: `/dashboard/${id}`,
//     method: 'get'
//   })
// }

export function fetchIndices() {
  return request({
    url: `/alert/indexes`,
    method: 'get'
  })
}

export function fetchMappingIndex(id) {
  return request({
    url: `/alert/${id}`,
    method: 'get'
  })
}

export function alertFetchAll(query) {
  return request({
    url: '/alert',
    method: 'get',
    params: query
  })
}

export function alertCreate(data, id) {
  return request({
    url: `/alert/${id}`,
    method: 'post',
    data
  })
}

export function alertDelete(id) {
  return request({
    url: `/alert/${id}`,
    method: 'delete'
  })
}

