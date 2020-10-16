<template>
  <div class="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      class="map"
    >
      <!--
      @click="showInfo = false"
      -->
      <l-control-layers position="bottomleft" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :url="tileProvider.url"
        :visible="tileProvider.visible"
        layer-type="base"
      />
      <l-feature-group
        v-for="data in queryObject"
        :key="data.layer_id"
        :name="data.layer_name"
        layer-type="overlay"
      >
        <l-marker
          v-for="mark in data.marks"
          :key="mark.name"
          :lat-lng="[mark.longitude, mark.latitude]"
        >
          <!--
          @click="markClick(mark)"
          -->
          <l-icon :icon-anchor="[22, 45]" :icon-size="[45, 43]">
            <img :src="assignIconByType(mark.type)">
          </l-icon>
          <l-tooltip class="tooltip-source">
            <div class="header">
              <i class="el-icon-info" />
              <strong>
                {{ $t('map.infoStation') }}
              </strong>
            </div>
            <div>
              <ul>
                <li>
                  <span>{{ $t('map.name') }}</span>
                  <strong>{{ mark.name }}</strong>
                </li>
                <li>
                  <span>{{ $t('map.longitude') }}</span>
                  <strong>{{ mark.longitude }}</strong>
                </li>
                <li>
                  <span>{{ $t('map.latitude') }}</span>
                  <strong>{{ mark.latitude }}</strong>
                </li>
                <li>
                  <span>{{ $t('map.lastValue') }}</span>
                  <strong>{{ mark.water_height }} cm.</strong>
                </li>
                <li>
                  <span>{{ $t('map.waterTrend') }}</span>
                  <strong>{{ mark.water_trend }}</strong>
                </li>
              </ul>
            </div>
          </l-tooltip>
          <!--<l-tooltip :content="mark.name" />-->
        </l-marker>
      </l-feature-group>
      <!--<el-dialog v-if="pointProperties != null" :title="dialogTitle" :visible.sync="dialogCompleteSerie" width="50%" hide-overlay transition="dialog-bottom-transition">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="item in pointProperties.KPIs" :key="item.title" :name="item.id">
            <span slot="label">
              <i :class="item.icon" />
              {{ item.title }}
            </span>
            <span class="negrita" style="padding-left:20px">{{ item.subtitle }}</span>
            <span style="padding-left:20px" />
            <div v-if="item.id ==='1'" :id="item.completeContainerName" style="margin-left:25px;height: 400px; width: 100%;" />
            <div v-if="item.id ==='2'" :id="item.completeContainerName" style="margin-left:25px;height: 400px; width: 400px;" />
            <div class="dialog-footer">
              <el-button v-if="item.exportToExcel" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                {{ $t('common.exportExcel') }}
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>-->
    </l-map>
  </div>
</template>

<script>

import { latLng } from 'leaflet'
// import L from 'leaflet'
import search from 'leaflet-search' // eslint-disable-line no-unused-vars
import 'leaflet-search/src/leaflet-search.css'
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LFeatureGroup,
  LTooltip,
  LIcon
} from 'vue2-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

const provider = new OpenStreetMapProvider()

import { getLatestValueForEachSensor } from '@/api/dataextractor_IH'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LFeatureGroup,
    // VGeosearch,
    LTooltip,
    LIcon
  },
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    filtered: {
      type: Object,
      default: function() {
        return {
          start: null,
          end: null,
          source: '',
          id: []
        }
      }
    },
    definition: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [],
      dataTable: [],
      oneRegister: true,
      sensorsCollection: [],
      activeInput: ['0'],
      zoom: 13,
      center: latLng(39.4458333, -0.32), // Puerto Valencia
      // center: latLng(44.85738, -0.54725645),
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        },
        {
          name: 'ESRI Satellite',
          visible: false,
          url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg'
        },
        {
          name: 'ESRI Topo',
          visible: false,
          url:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg'
        }
      ],
      geosearchOptions: {
        // Important part Here
        provider: provider, // new OpenStreetMapProvider(),
        autoClose: true,
        searchLabel: 'Enter address',
        autoComplete: true,
        style: 'bar'// bar or button
      },
      mapOptions: {
        zoomSnap: 0.5
      },
      showInfo: false,
      sitec: [],
      queryObject: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDataForMap()
    })
  },
  beforeDestroy() {},
  methods: {
    getDataForMap() {
      var execution = false

      if (this.filtered.source !== '') {
        execution = true
      } else {
      // mapa inicial para pantalla intermedia
      }

      if (execution) {
        this.center = this.obtainMapCenter(this.filtered.source[0])
        var id_layer = 1
        this.filtered.source.forEach(sourceId => {
          getLatestValueForEachSensor(sourceId).then(response => {
            console.log('Salida de getLatestValueForEachSensor')
            console.log(response)
            var sensors = response
            var marks = []
            var aSensorType
            sensors.forEach(sensor => {
              var addModel = {}
              addModel.name = sensor.data.name
              if (id_layer === 2) {
                addModel.longitude = sensor.data.location.lon - 2.5
                addModel.latitude = sensor.data.location.lat
              } else {
                addModel.longitude = sensor.data.location.lon
                addModel.latitude = sensor.data.location.lat
              }
              // addModel.longitude = sensor.data.location.lon
              // addModel.latitude = sensor.data.location.lat
              addModel.water_height = sensor.data.water_height
              addModel.water_trend = sensor.data.water_trend
              var source = sensor.data.source
              aSensorType = source.split(':')
              if (id_layer === 2) {
                addModel.type = 'Weather Sensor'
                aSensorType[1] = 'Weather Sensor'
              } else {
                addModel.type = aSensorType[1]
              }
              // addModel.type = aSensorType[1]
              marks.push(addModel) // Object to draw items in the map
            })
            // this.recoverSensors(response)
            var layer = {
              layer_name: aSensorType[1],
              layer_id: id_layer,
              icon: 'icono1',
              marks: marks
            }
            id_layer = id_layer + 1
            this.queryObject.push(layer)
          })
        })
        console.log('Objeto resultado')
        console.log(this.queryObject)
      }
    },
    obtainMapCenter(sourceId) {
      console.log(sourceId)
      var arrLOCODE = sourceId.split(':')
      var center
      switch (arrLOCODE[0]) {
        case 'FR_BOD':
          center = latLng(44.85738, -0.54725645)
          break
        case 'GR_PIR':
          center = latLng(44.85738, -0.54725645)
          break
        case 'GR_SKG':
          center = latLng(44.85738, -0.54725645)
          break
        case 'IT_MNF':
          center = latLng(44.85738, -0.54725645)
          break
      }
      return center
    },
    recoverSensors(sensors) {
      var marks = []
      // var features = []
      sensors.forEach(sensor => {
        var addModel = {}
        addModel.name = sensor.data.name
        addModel.longitude = sensor.data.location.lon
        addModel.latitude = sensor.data.location.lat
        addModel.water_height = sensor.data.water_height
        addModel.water_trend = sensor.data.water_trend
        var source = sensor.data.source
        var aSensorType = source.split(':')
        addModel.type = aSensorType[1]
        marks.push(addModel) // Object to draw items in the map
        /*
        var featuresItem = {
          'type': 'Feature',
          'properties': {
            'name': sensor.data.name
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [
              sensor.data.location.lat,
              sensor.data.location.lon
            ]
          }
        }
        features.push(featuresItem) // Object to look for location in the map
        */
      })
      this.queryObject = [
        {
          layer_name: 'Tide Sensors',
          layer_id: '1',
          icon: 'icono1',
          marks: marks
        }
      ]
      /* this.sitec =
      {
        'type': 'FeatureCollection',
        'features': features
      }*/
    },
    assignIconByType(type) {
      var icon = ''
      switch (type) {
        case 'Complex Station':
          icon = require('../../../assets/sensors/icon_station.svg')
          break
        case 'TideSensor':
          icon = require('../../../assets/sensors/icon_tide.svg')
          break
        case 'Weather Sensor':
          icon = require('../../../assets/sensors/icon_solar.svg')
          break
      }
      return icon
    }
  }
}
</script>
