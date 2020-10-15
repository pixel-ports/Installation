import request from '@/utils/request_dashboard'

export function alertTemplateFetchList() {
  return request({
    url: '/alerttemplate',
    method: 'get'
  })
}
