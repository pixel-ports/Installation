import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

export function widgetDashboardFetchList(query) {
  return request({
    url: '/widget/published',
    method: 'get'
  })
}

export function widgetFetchList(query) {
  return request({
    url: '/widget',
    method: 'get',
    params: query
  })
}

export function widgetCreate(data) {
  return request({
    url: '/widget',
    method: 'post',
    data
  })
}

export function widgetUpdate(id, data) {
  return request({
    url: `/widget/${id}`,
    method: 'put',
    data
  })
}

export function widgetDelete(id) {
  return request({
    url: `/widget/${id}`,
    method: 'delete'
  })
}

