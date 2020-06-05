import request from '@/utils/request_dashboard'

export function supplierChainFetchList(query) {
  return request({
    url: '/supplierChain',
    method: 'get',
    params: query
  })
}

export function supplierChainCreate(data) {
  console.log(data)
  return request({
    url: '/supplierChain',
    method: 'post',
    data
  })
}

export function supplierChainUpdate(id, data) {
  return request({
    url: `/supplierChain/${id}`,
    method: 'put',
    data
  })
}

export function supplierChainDelete(id) {
  return request({
    url: `/supplierChain/${id}`,
    method: 'delete'
  })
}

export function supplierChainGet(id) {
  return request({
    url: `/supplierChain/${id}`,
    method: 'get'
  })
}

