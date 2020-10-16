import request from '@/utils/request_dashboard'

export function getUsers() {
  return request({
    url: '/idm/user',
    method: 'get'
  })
}

export function deleteUser(id) {
  return request({
    url: `/idm/user/${id}`,
    method: 'delete'
  })
}

export function createUser(data) {
  return request({
    url: '/idm/user',
    method: 'post',
    data
  })
}

export function updateUser(data, id) {
  return request({
    url: `/idm/user/${id}`,
    method: 'put',
    data
  })
}

export function getRoles() {
  return request({
    url: '/idm/roles',
    method: 'get'
  })
}

export function deleteRoles(id) {
  return request({
    url: `/idm/roles/${id}`,
    method: 'delete'
  })
}

export function createRoles(data) {
  return request({
    url: '/idm/roles',
    method: 'post',
    data
  })
}

export function updateRoles(data, id) {
  return request({
    url: `/idm/roles/${id}`,
    method: 'put',
    data
  })
}

export function getRolesUser(userId) {
  return request({
    url: `/idm/roles-user/${userId}`,
    method: 'get'
  })
}

export function addRolesUser(userId, roleID) {
  return request({
    url: `/idm/roles-user/${userId}/${roleID}`,
    method: 'post'
  })
}

export function deleteRolesUser(userId, roleID) {
  return request({
    url: `/idm/roles-user/${userId}/${roleID}`,
    method: 'delete'
  })
}
