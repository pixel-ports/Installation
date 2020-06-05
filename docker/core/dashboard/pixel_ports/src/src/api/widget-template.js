import request from '@/utils/request_dashboard'
// TODO: Cambair ruta a donde toca
export function widgetTemplateFetchList(query) {
  return request({
    url: '/widgettemplate',
    method: 'get'
  })
}
