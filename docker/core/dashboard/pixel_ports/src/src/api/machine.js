import request from '@/utils/request_dashboard'

export function machineFetchList(query) {
  return request({
    url: '/machine',
    method: 'get',
    params: query
  })
}

export function machineFilterByResource(id) {
  return request({
    url: `/machine/filterMachineByResource/${id}`,
    method: 'get'
  })
}

export function machineFilterByShiftWork(id) {
  return request({
    url: `/machine/filterMachineByShiftWork/${id}`,
    method: 'get'
  })
}

export function machineCreate(data) {
  return request({
    url: '/machine',
    method: 'post',
    data
  })
}

export function machineUpdate(id, data) {
  return request({
    url: `/machine/${id}`,
    method: 'put',
    data
  })
}

export function machineDelete(id) {
  return request({
    url: `/machine/${id}`,
    method: 'delete'
  })
}

export function machineGet(id) {
  return request({
    url: `/machine/${id}`,
    method: 'get'
  })
}

