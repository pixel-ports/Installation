import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function stepFetchList(query) {
  return request({
    url: '/step',
    method: 'get',
    params: query
  })
}

export function stepFilterBySC(id) {
  return request({
    url: `/step/filterBySC/${id}`,
    method: 'get'
  })
}

export function stepCreate(data) {
  return request({
    url: '/step',
    method: 'post',
    data
  })
}

export function stepUpdate(id, data) {
  return request({
    url: `/step/${id}`,
    method: 'put',
    data
  })
}

export function stepDelete(id) {
  return request({
    url: `/step/${id}`,
    method: 'delete'
  })
}

export function stepGet(id) {
  return request({
    url: `/step/${id}`,
    method: 'get'
  })
}

