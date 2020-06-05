import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function validityFetchList(query) {
  return request({
    url: '/validity',
    method: 'get',
    params: query
  })
}

export function validityFilterByRule(id) {
  return request({
    url: `/validity/filterByRule/${id}`,
    method: 'get'
  })
}

export function validityCreate(data) {
  return request({
    url: '/validity',
    method: 'post',
    data
  })
}

export function validityUpdate(id, data) {
  return request({
    url: `/validity/${id}`,
    method: 'put',
    data
  })
}

export function validityDelete(id) {
  return request({
    url: `/validity/${id}`,
    method: 'delete'
  })
}

export function validityGet(id) {
  return request({
    url: `/validity/${id}`,
    method: 'get'
  })
}

