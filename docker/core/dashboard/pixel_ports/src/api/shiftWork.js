import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function shiftWorkFetchList(query) {
  return request({
    url: '/shiftWork',
    method: 'get',
    params: query
  })
}

export function shiftWorkFilterByRule(id) {
  return request({
    url: `/shiftWork/filterByRule/${id}`,
    method: 'get'
  })
}

export function shiftWorkCreate(data) {
  return request({
    url: '/shiftWork',
    method: 'post',
    data
  })
}

export function shiftWorkUpdate(id, data) {
  return request({
    url: `/shiftWork/${id}`,
    method: 'put',
    data
  })
}

export function shiftWorkDelete(id) {
  return request({
    url: `/shiftWork/${id}`,
    method: 'delete'
  })
}

export function shiftWorkGet(id) {
  return request({
    url: `/shiftWork/${id}`,
    method: 'get'
  })
}

