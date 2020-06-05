import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import FormBuilder from 'element-form-builder'

import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// TODO: Remove this to online
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(FormBuilder)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueFormWizard)

Vue.config.productionTip = false

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch//assets/css/leaflet.css'

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4plugins_bullets from '@amcharts/amcharts4/plugins/bullets'
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected'
import * as am4plugins_timeline from '@amcharts/amcharts4/plugins/timeline'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
Object.defineProperty(Vue.prototype, '$am4core', { value: am4core })
Object.defineProperty(Vue.prototype, '$am4charts', { value: am4charts })
Object.defineProperty(Vue.prototype, '$am4pluginsBullets', { value: am4plugins_bullets })
Object.defineProperty(Vue.prototype, '$am4pluginsForceDirected', { value: am4plugins_forceDirected })
Object.defineProperty(Vue.prototype, '$am4pluginsTimeline', { value: am4plugins_timeline })
am4core.useTheme(am4themes_animated)

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
