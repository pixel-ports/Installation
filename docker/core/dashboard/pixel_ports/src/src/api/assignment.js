import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function assignmentFetchList(query) {
  return request({
    url: '/assignment',
    method: 'get',
    params: query
  })
}

export function assignmentFilterByRule(id) {
  return request({
    url: `/assignment/filterByRule/${id}`,
    method: 'get'
  })
}

export function assignmentCreate(data) {
  return request({
    url: '/assignment',
    method: 'post',
    data
  })
}

export function assignmentUpdate(id, data) {
  return request({
    url: `/assignment/${id}`,
    method: 'put',
    data
  })
}

export function assignmentDelete(id) {
  return request({
    url: `/assignment/${id}`,
    method: 'delete'
  })
}

export function assignmentGet(id) {
  return request({
    url: `/assignment/${id}`,
    method: 'get'
  })
}

