import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function detailFetchList(query) {
  return request({
    url: '/detail',
    method: 'get',
    params: query
  })
}

export function detailFilterBySC(id) {
  return request({
    url: `/detail/filterBySC/${id}`,
    method: 'get'
  })
}

export function detailCreate(data) {
  return request({
    url: '/detail',
    method: 'post',
    data
  })
}

export function detailUpdate(id, data) {
  return request({
    url: `/detail/${id}`,
    method: 'put',
    data
  })
}

export function detailDelete(id) {
  return request({
    url: `/detail/${id}`,
    method: 'delete'
  })
}

export function detailGet(id) {
  return request({
    url: `/detail/${id}`,
    method: 'get'
  })
}

