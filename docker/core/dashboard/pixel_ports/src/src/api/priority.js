import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function priorityFetchList(query) {
  return request({
    url: '/priority',
    method: 'get',
    params: query
  })
}

export function priorityFilterByRule(id) {
  return request({
    url: `/priority/filterByRule/${id}`,
    method: 'get'
  })
}

export function priorityCreate(data) {
  return request({
    url: '/priority',
    method: 'post',
    data
  })
}

export function priorityUpdate(id, data) {
  return request({
    url: `/priority/${id}`,
    method: 'put',
    data
  })
}

export function priorityDelete(id) {
  return request({
    url: `/priority/${id}`,
    method: 'delete'
  })
}

export function priorityGet(id) {
  return request({
    url: `/priority/${id}`,
    method: 'get'
  })
}

