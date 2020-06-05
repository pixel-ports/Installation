import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function compatibilityFetchList(query) {
  return request({
    url: '/compatibility',
    method: 'get',
    params: query
  })
}

export function compatibilityFilterBySC(id) {
  return request({
    url: `/compatibility/filterBySC/${id}`,
    method: 'get'
  })
}

export function compatibilityCreate(data) {
  return request({
    url: '/compatibility',
    method: 'post',
    data
  })
}

export function compatibilityUpdate(id, data) {
  return request({
    url: `/compatibility/${id}`,
    method: 'put',
    data
  })
}

export function compatibilityDelete(id) {
  return request({
    url: `/compatibility/${id}`,
    method: 'delete'
  })
}

export function compatibilityGet(id) {
  return request({
    url: `/compatibility/${id}`,
    method: 'get'
  })
}

