import request from '@/utils/request_dashboard'

export function ruleFetchList(query) {
  return request({
    url: '/rule',
    method: 'get',
    params: query
  })
}

export function ruleCreate(data) {
  console.log(data)
  return request({
    url: '/rule',
    method: 'post',
    data
  })
}

export function ruleUpdate(id, data) {
  return request({
    url: `/rule/${id}`,
    method: 'put',
    data
  })
}

export function ruleDelete(id) {
  return request({
    url: `/rule/${id}`,
    method: 'delete'
  })
}

export function ruleGet(id) {
  return request({
    url: `/rule/${id}`,
    method: 'get'
  })
}

