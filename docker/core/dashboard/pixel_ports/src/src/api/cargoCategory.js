import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function cargoCategoryFetchList(query) {
  return request({
    url: '/cargoCategory',
    method: 'get',
    params: query
  })
}

export function cargoCategoryFilterByRule(id) {
  return request({
    url: `/cargoCategory/filterByRule/${id}`,
    method: 'get'
  })
}

export function cargoCategoryCreate(data) {
  return request({
    url: '/cargoCategory',
    method: 'post',
    data
  })
}

export function cargoCategoryUpdate(id, data) {
  return request({
    url: `/cargoCategory/${id}`,
    method: 'put',
    data
  })
}

export function cargoCategoryDelete(id) {
  return request({
    url: `/cargoCategory/${id}`,
    method: 'delete'
  })
}

export function cargoCategoryGet(id) {
  return request({
    url: `/cargoCategory/${id}`,
    method: 'get'
  })
}

