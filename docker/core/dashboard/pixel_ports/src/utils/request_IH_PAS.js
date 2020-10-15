import axios from 'axios'
// import pixelConstants from '@/utils/constants' // import class for constants
// import { isElementInViewport } from '@amcharts/amcharts4/.internal/core/utils/DOM'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_DATA_API_PAS,
  // baseURL: pixelConstants.APP_BASE_DATA_API_PAS,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // const res = JSON.stringify(response.data, null, 4)
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
