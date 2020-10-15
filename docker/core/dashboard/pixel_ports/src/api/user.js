import request from '@/utils/request_ID'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/oauth2/token',
    method: 'post',
    headers: {
      Authorization: 'Basic ' + window.btoa(unescape(encodeURIComponent(process.env.VUE_APP_BASE_ID_CLIENT_ID + ':' + process.env.VUE_APP_BASE_ID_SECRET_KEY))),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      'grant_type': 'password',
      'username': data.username,
      'password': data.password,
      'scope': 'permanent'
    })
  })
}

export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
    params: { access_token: token }
  })
}

export function logout(token) {
  return request({
    url: '/oauth2/revoke',
    method: 'post',
    headers: {
      Authorization: 'Basic ' + window.btoa(unescape(encodeURIComponent(process.env.VUE_APP_BASE_ID_CLIENT_ID + ':' + process.env.VUE_APP_BASE_ID_SECRET_KEY))),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      token: token,
      token_type_hint: 'access_token'
    })
  })
}
