import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca

/* export function widgetDashboardFetchList(query) {
  return request({
    url: '/widget/published',
    method: 'get'
  })
}*/

export function dashboardFetchList(query) {
  return request({
    url: '/dashboard',
    method: 'get',
    params: query
  })
}

export function dashboardCreate(data) {
  return request({
    url: '/dashboard',
    method: 'post',
    data
  })
}

export function dashboardUpdate(id, data) {
  return request({
    url: `/dashboard/${id}`,
    method: 'put',
    data
  })
}

export function dashboardDelete(id) {
  return request({
    url: `/dashboard/${id}`,
    method: 'delete'
  })
}

export function dashboardGet(id) {
  return request({
    url: `/dashboard/${id}`,
    method: 'get'
  })
}

