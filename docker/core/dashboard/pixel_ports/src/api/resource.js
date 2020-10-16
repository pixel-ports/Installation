import request from '@/utils/request_dashboard'

export function resourceFetchList(query) {
  return request({
    url: '/resource',
    method: 'get',
    params: query
  })
}

export function resourceCreate(data) {
  console.log(data)
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function resourceUpdate(id, data) {
  console.log('Llego al fichero resource.js')
  return request({
    url: `/resource/${id}`,
    method: 'put',
    data
  })
}

export function resourceDelete(id) {
  return request({
    url: `/resource/${id}`,
    method: 'delete'
  })
}

export function resourceGet(id) {
  return request({
    url: `/resource/${id}`,
    method: 'get'
  })
}

