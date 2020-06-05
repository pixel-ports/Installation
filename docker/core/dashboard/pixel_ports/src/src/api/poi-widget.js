import request from '@/utils/request'
// TODO: Cambair ruta a donde toca
export function fetchList(query) {
  return request({
    url: 'https://api-dashboard.demo.pixel-ports.eu/widget',
    method: 'get'
  })
}
