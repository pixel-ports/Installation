import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function areaFetchList(query) {
  return request({
    url: '/area',
    method: 'get',
    params: query
  })
}

export function areaFilterByResource(id) {
  return request({
    url: `/area/filterByResource/${id}`,
    method: 'get'
  })
}

export function areaCreate(data) {
  return request({
    url: '/area',
    method: 'post',
    data
  })
}

export function areaUpdate(id, data) {
  return request({
    url: `/area/${id}`,
    method: 'put',
    data
  })
}

export function areaDelete(id) {
  return request({
    url: `/area/${id}`,
    method: 'delete'
  })
}

export function areaGet(id) {
  return request({
    url: `/area/${id}`,
    method: 'get'
  })
}

