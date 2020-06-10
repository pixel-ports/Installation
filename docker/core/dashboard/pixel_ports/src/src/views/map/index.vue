<template>
  <div class="map-container">
    <div class="info" :class="[{ active: showInfo }]">
      <el-row justify="center">
        <el-col :span="24">
          <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <span>
                <strong>
                  {{ nameSensor }}
                </strong>
                <span style="padding-left:20px" />
                <el-tooltip class="item" effect="dark" :content="$t('map.completeSerie')" placement="top-start">
                  <i class="el-icon-zoom-in" @click="showCompleteSerie()" />
                </el-tooltip>
              </span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="closeInformation()"
              >{{ $t('map.close') }}</el-button>
            </div>
            <div ref="g1" style="height: 400px; width: 100%;" />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-drawer v-if="pointProperties != null" :title="nameSensorAndLocation" class="negrita" direction="rtl" size="25%" :visible.sync="widgetsDialog" :with-header="true">
      <!--<span style="padding-left:20px;">{{ pointProperties.type }}</span>-->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="item in pointProperties.KPIs" :key="item.title" :name="item.id">
          <span slot="label">
            <i :class="item.icon" />
            {{ item.title }}
          </span>
          <span class="negrita" style="padding-left:20px">{{ item.subtitle }}</span>
          <span style="padding-left:20px" />
          <el-tooltip class="item" effect="dark" :content="$t('map.completeSerie')" placement="top-start">
            <i class="el-icon-zoom-in" @click="showCompleteSerie(item.title)" />
          </el-tooltip>
          <div :id="item.containerName" style="margin-left:25px;height: 400px; width: 400px;" />
        </el-tab-pane>
      </el-tabs>
      <!--<el-tabs :tab-position="tabPosition" style="height: 400px;">
        <el-tab-pane v-for="item in pointProperties.KPIs" :key="item.title" :name="item.title">
          <span slot="label">
            <i :class="item.icon" />
            {{ item.title }}
          </span>
          <span class="negrita" style="padding-left:20px">{{ item.title }}</span>
          <span style="padding-left:20px" />
          <el-tooltip class="item" effect="dark" :content="$t('map.completeSerie')" placement="top-start">
            <i class="el-icon-zoom-in" @click="showMoreData()" />
          </el-tooltip>
          <div :id="item.containerName" style="height: 400px; width: 100%;" />
        </el-tab-pane>
      </el-tabs>-->
    </el-drawer>
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      class="map"
      @click="showInfo = false"
    >
      <l-control-layers position="bottomleft" />
      <!-- <v-geosearch :options="geosearchOptions" /> -->
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :url="tileProvider.url"
        :visible="tileProvider.visible"
        layer-type="base"
      />
      <l-feature-group
        v-for="data in peticion1"
        :key="data.layer_id"
        :name="data.layer_name"
        layer-type="overlay"
      >
        <l-marker
          v-for="mark in data.marks"
          :key="mark.name"
          :lat-lng="[mark.longitude, mark.latitude]"
          @click="markClick(mark)"
        >
          <l-icon :icon-anchor="[22, 45]" :icon-size="[45, 43]">
            <img :src="assignIconByType(mark.type)">
          </l-icon>
          <l-tooltip class="tooltip-source">
            <div class="header">
              <i class="el-icon-info" />
              <!--<svg-icon icon-class="icon" class-name="custom-class" color="red" />-->
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
                <!--<li>
                  <span>{{ $t('map.dataSampling') }}</span>
                  <strong>{{ mark.dataSampling }}</strong>
                </li>-->
              </ul>
            </div>
          </l-tooltip>
          <!--<l-tooltip :content="mark.name" />-->
        </l-marker>
      </l-feature-group>
      <el-dialog v-if="pointProperties != null" :title="dialogTitle" :visible.sync="dialogCompleteSerie" width="50%" hide-overlay transition="dialog-bottom-transition">
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
            <!--<div :id="item.completeContainerName" style="margin-left:25px;height: 400px; width: 100%;" />-->
            <div class="dialog-footer">
              <el-button v-if="item.exportToExcel" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                {{ $t('common.exportExcel') }}
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!--<div ref="g2" style="height: 400px; width: 100%" />
        <div slot="footer" class="dialog-footer">
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
            {{ $t('common.exportExcel') }}
          </el-button>
        </div>-->
      </el-dialog>
    </l-map>
  </div>
</template>

<!--<script src="//unpkg.com/vue/dist/vue.js"></script>
<script src="//unpkg.com/element-ui@2.13.0/lib/index.js"></script>-->
<script>
import { dataExtractor } from '@/api/dataextractor_IH'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import resize from '@/components/widget/mixins/resize'
// Is highly suggested to import only the needed modules by doing so:
import { latLng } from 'leaflet'
import L from 'leaflet'
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

// import VGeosearch from 'vue2-leaflet-geosearch'

import echarts from 'echarts'
// import leafletControl from 'leaflet-geosearch/lib/leafletControl'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'Map',
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
  directives: { waves },
  mixins: [resize],
  props: {},
  data() {
    return {
      zoom: 13,
      pointProperties: null,
      nameSensorAndLocation: '',
      activeName: '1',
      tabPosition: 'right',
      widgetsDialog: false, // Dialog with drawer for widgets
      downloadLoading: false, // Export to excel
      center: latLng(44.85738, -0.54725645),
      chart: null,
      name: '',
      divider: 0,
      sumatory: 0,
      longitudeSensor: '',
      latitudeSensor: '',
      nameSensor: '',
      nameToolTip: '',
      dialogCompleteSerie: false,
      dialogTitle: '',
      dataError: 0,
      dataXTideSensor: null,
      dataYTideSensor: null,
      listForExcel: null,
      longitudeToolTip: '',
      latitudeToolTip: '',
      dataSamplingToolTip: '',
      searchTextErr: '',
      cancel: '',
      searchPlaceHolder: '',
      titleLegend: '',
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
      peticion1: [] /* peticion1: [
        {
          layer_name: 'Tide Sensors',
          layer_id: '1',
          icon: 'icono1',
          marks: [
            {
              name: 'Bordeaux',
              longitude: 44.859981,
              latitude: -0.552806,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Bassens',
              longitude: 44.904192,
              latitude: -0.537278,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Le Marquis',
              longitude: 45.003120,
              latitude: -0.559671,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Ambes',
              longitude: 45.040581,
              latitude: -0.603611,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Fort Medoc',
              longitude: 45.117270,
              latitude: -0.700259,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Pauillac',
              longitude: 45.218032,
              latitude: -0.746079,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'LaMena',
              longitude: 45.335732,
              latitude: -0.795220,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Richard',
              longitude: 45.453666,
              latitude: -0.923050,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            },
            {
              name: 'Port Bloc',
              longitude: 45.568436,
              latitude: -1.061534,
              cosa: 6,
              tipo: 'Tide Sensor',
              dataSampling: '60 minutes',
              values: ['Humidity', 'Temperature', 'Pressure'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'XRT45 Quality Air',
              web2: 'https://www.vaisala.com/es'
            }
          ]
        },
        {
          layer_name: 'Weather Sensors',
          layer_id: '2',
          icon: 'icono2',
          marks: [
            {
              longitude: 44.8861111,
              latitude: -0.5319444444444444,
              name: 'Name 2',
              cosa: 10,
              tipo: 'Weather Sensor',
              dataSampling: '60 minutes',
              values: ['Dust', 'PM10', 'PM2.5', 'CO2'],
              manufacturer: 'Vaisala',
              web1: 'https://www.vaisala.com/es',
              model: 'bQ90LX-007',
              web2: 'https://www.vaisala.com/es'
            }
          ]
        }
      ] */
    }
  },
  watch: {
    lang() {
      this.setOptions()
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
      this.addLegend()
      this.getData_IH()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.setOptions()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('map.observed'), this.$t('map.water_height'), this.$t('map.water_trend')]
        const filterVal = ['observed', 'water_height', 'water_trend']
        const data = this.formatJson(filterVal, this.listForExcel)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.name + '_toExcel'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getData_IH() {
      var fechaFinal = this.sumaFecha(0)
      // console.log(fechaFinal)
      var aFecha = fechaFinal.split('-')
      var TimeStampFinal = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      var dataString =
      {
        'source': {
          'sourceId': 'urn:pixel:DataSource:frbod:TideSensorObserved'
        },
        'filters': [
          {
            'fieldName': 'dataProvider',
            'condition': 'matches',
            'value': 'https://nami.bordeaux-port.fr/hauteurs'
          }
        ],
        'timeIntervals': [
          {
            'start': 0,
            'end': TimeStampFinal // 1578661926000
          }
        ]
      }
      dataExtractor(dataString).then(response => {
        console.log('Aqui estoy')
        console.log(response)
        // console.log(response[0].sensors)
        this.recoverDifferentTideSensors(response)
      })// .catch(err => { console.log(err) })
    },
    addKPIsBySensor(type) {
      // console.log(type)
      var KPIs = ''
      switch (type) {
        case 'TideSensor':
          KPIs = [
            {
              id: '1',
              title: 'Tide Level',
              icon: 'el-icon-data-analysis',
              containerName: 'tideLevelChart',
              completeContainerName: 'completeTideLevelChart',
              subtitle: this.$t('map.subtitleTideLevel'),
              exportToExcel: true
            },
            { id: '2',
              title: 'Efficiency',
              icon: 'el-icon-picture-outline',
              containerName: 'efficiencyChart',
              completeContainerName: 'completeEfficiencyChart',
              subtitle: this.$t('map.subtitleEfficiency'),
              exportToExcel: false
            }
          ]
          break
      }
      return KPIs
    },
    recoverDifferentTideSensors(sensors) {
      var marks = []
      var features = []
      for (var counter = 0; counter <= 10; counter++) {
        // Debo excluir la ubicación B.A.F.
        if (sensors[counter].data.name !== 'B.A.F.') {
          var addModel = {}
          addModel.name = sensors[counter].data.name
          addModel.longitude = sensors[counter].data.location.lon
          addModel.latitude = sensors[counter].data.location.lat
          var source = sensors[counter].data.source
          var aSensorType = source.split(':')
          addModel.type = aSensorType[1]
          addModel.KPIs = this.addKPIsBySensor(addModel.type)
          marks.push(addModel) // Object to draw items in the map
          var featuresItem = {
            'type': 'Feature',
            'properties': {
              'name': sensors[counter].data.name
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [
                sensors[counter].data.location.lat,
                sensors[counter].data.location.lon
              ]
            }
          }
          features.push(featuresItem) // Object to look for location in the map
        }
      }
      this.peticion1 = [
        {
          layer_name: 'Tide Sensors',
          layer_id: '1',
          icon: 'icono1',
          marks: marks
        }
      ]
      console.log(this.peticion1)
      this.sitec =
      {
        'type': 'FeatureCollection',
        'features': features
      }
      this.addSearchBar()
    },
    setOptions() {
      this.longitudeToolTip = this.$t('map.longitude')
      this.latitudeToolTip = this.$t('map.latitude')
      this.titleLegend = this.$t('map.titleLegend')
      this.searchTextErr = this.$t('map.searchTextErr')
      this.cancel = this.$t('map.cancel')
      this.searchPlaceHolder = this.$t('map.searchPlaceHolder')
    },
    addSearchBar() {
      var longitude = this.longitudeToolTip
      var latitude = this.latitudeToolTip
      var searchTextErr = this.searchTextErr
      var cancel = this.cancel
      var searchPlaceHolder = this.searchPlaceHolder
      const map = this.$refs.map.mapObject // referencia al objeto mapa de vue2-leaflet
      var poiLayers = L.geoJSON(this.sitec, {
        pointToLayer: function(feature, latLng) {
          var smallIcon = new L.Icon({
            iconUrl: require('../../assets/sensors/icon_tide.svg')
          })
          return L.marker(latLng, { icon: smallIcon })
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup('<div class="header"><strong>' + feature.properties.name + '</strong></div><div><ul><li><span>' + longitude + '</span><strong>' + feature.geometry.coordinates[1] + '</strong></li><li><span>' + latitude + '</span><strong>' + feature.geometry.coordinates[0] + '</strong></li></ul></div>')
        }
      })
      var searchControl = new L.Control.Search({
        layer: poiLayers,
        initial: false,
        propertyName: 'name',
        textErr: searchTextErr,
        textCancel: cancel,
        textPlaceholder: searchPlaceHolder
      })

      searchControl.on('search:locationfound', function(e) {
        if (e.layer._popup) { e.layer.openPopup() }
      }).on('search:collapsed', function(e) {
        poiLayers.eachLayer(function(layer) {
          poiLayers.resetStyle(layer)
          poiLayers.removeLayer(layer.circleMarker)
          console.log(layer)
        })
      })

      map.addControl(searchControl)
    },
    addLegend() {
      var legendTitle = this.titleLegend
      const map = this.$refs.map.mapObject // referencia al objeto mapa de vue2-leaflet
      // Insertando una leyenda en el mapa
      var legend = new window.L.Control({ position: 'bottomright' })
      legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info-legend')
        var labels = ['<strong>' + legendTitle + '</strong>']
        var categories = ['Tide Sensor'] // , 'Weather Sensor']
        // 'icon_station',
        var icons = ['icon_tide'] // , 'icon_solar']
        for (var i = 0; i < categories.length; i++) {
          var im = require('../../assets/sensors/' + icons[i] + '.svg')
          div.innerHTML +=
          labels.push(categories[i] + ': ' + '<img src=' + im + ' style="width:35px;height:35px">')
        }
        div.innerHTML = labels.join('<br>')
        div.style.overflow = 'hidden'
        div.style.color = '#666'
        div.style.background = '#fff'
        div.style.padding = '10px 10px 10px 10px'
        div.style.border = '2px solid'
        div.style.borderRadius = '10px'
        return div
      }
      legend.addTo(map)
    },
    showCompleteSerie(kpiName) {
      console.log(kpiName)
      this.dialogTitle = this.nameSensor
      var fechaFinal = this.sumaFecha(0)
      var fechaInicial = 0
      this.recoverSensorInformationForDrawer(this.pointProperties.type, fechaInicial, fechaFinal, true)
      // this.recoverInformationForTideSensor(fechaInicial, fechaFinal, true)
      this.widgetsDialog = false
      this.dialogCompleteSerie = true
    },
    showCompleteSerie_original() {
      this.dialogTitle = this.nameSensor
      var fechaFinal = this.sumaFecha(0)
      var fechaInicial = 0
      this.recoverInformationForTideSensor(fechaInicial, fechaFinal, true)
      this.dialogCompleteSerie = true
      this.showInfo = false
    },
    markClick(mark) {
      // Assign the specific POI to pointProperties
      this.pointProperties = mark
      //  Establish name
      this.name = mark.name
      this.longitudeSensor = mark.longitude
      this.latitudeSensor = mark.latitude
      this.nameSensorAndLocation = mark.type + ': ' + this.name + ' (' + this.longitudeSensor + ', ' + this.latitudeSensor + ')'
      // Filtering by one week
      var fechaFinal = this.sumaFecha(0)
      var fechaInicial = this.sumaFecha(-7)
      this.recoverSensorInformationForDrawer(mark.type, fechaInicial, fechaFinal, false)
      this.widgetsDialog = true
    },
    markClick_old(mark) {
      //  Establish name
      this.name = mark.name
      this.longitudeSensor = mark.longitude
      this.latitudeSensor = mark.latitude
      // Filtering by one week
      var fechaFinal = this.sumaFecha(0)
      var fechaInicial = this.sumaFecha(-7)
      // console.log('fecha inicial: ' + fechaInicial)
      // console.log('fecha final: ' + fechaFinal)
      this.recoverInformationForTideSensor(fechaInicial, fechaFinal, false)
      this.showInfo = true
    },
    toTimestamp(year, month, day, hour, minute, second) {
      var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      return datum.getTime()// / 1000
    },
    recoverSensorInformationForDrawer(typeSensor, fechaInicial, fechaFinal, completeSerie) {
      // Establish name of the sensor
      this.nameSensor = this.name + ' (' + this.longitudeSensor + ', ' + this.latitudeSensor + ')'
      //  Convert date to TimeStamp
      var aFecha = fechaFinal.split('-')
      var TimeStampFinal = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      var TimeStampInicial = null
      if (completeSerie) {
        TimeStampInicial = 0
      } else {
        aFecha = fechaInicial.split('-')
        TimeStampInicial = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      }
      // console.log(TimeStampInicial)
      // console.log(TimeStampFinal)
      var sourceId = ''
      switch (typeSensor) {
        case 'TideSensor':
          sourceId = 'urn:pixel:DataSource:frbod:TideSensorObserved'
          break
      }
      var dataString =
      {
        'source': {
          'sourceId': sourceId
        },
        'filters': [
          {
            'fieldName': 'name',
            'condition': 'matches',
            'value': this.name
          },
          {
            'fieldName': 'observed',
            'condition': 'greater',
            'value': TimeStampInicial
          },
          {
            'fieldName': 'observed',
            'condition': 'lower',
            'value': TimeStampFinal
          }
        ],
        'timeIntervals': [
          {
            'start': 0,
            'end': TimeStampFinal
          }
        ]
      }
      // console.log(dataString)
      dataExtractor(dataString).then(response => {
        // console.log('answer: ' + response)
        // Add an if statement for each different type of sensor
        if (typeSensor === 'TideSensor') {
          this.prepareDataForTideSensor(response, fechaInicial, fechaFinal, completeSerie)
        }
      })// .catch(err => { console.log(err) })
    },
    prepareDataForTideSensor(items, fechaInicial, fechaFinal, completeSerie) {
      var arrSensors = items
      var arrX = []
      var arrY = []
      this.divider = arrSensors.length
      this.sumatory = 0
      var counterError = 0
      var listForExcel = []
      for (var counter = 0; counter <= arrSensors.length - 1; counter++) {
        if (parseInt(arrSensors[counter].data.water_height, 10) === 888) {
          counterError += 1
        } else {
          var convertToInteger = parseInt(arrSensors[counter].data.water_height, 10)
          var valueToSumatory = Number(convertToInteger / 100).toFixed(1)
          this.sumatory = this.sumatory + parseFloat(valueToSumatory)
          arrY.push(valueToSumatory)
          arrX.push(parseTime(arrSensors[counter].data.observed))
          // Items for Export to Excel
          var itemForExcel = {}
          itemForExcel.observed = parseTime(arrSensors[counter].data.observed)
          itemForExcel.water_height = valueToSumatory + 'm'
          itemForExcel.water_trend = arrSensors[counter].data.water_trend
          listForExcel.push(itemForExcel)
        }
      }
      this.dataError = counterError
      this.dataXTideSensor = arrX
      this.dataYTideSensor = arrY
      this.listForExcel = listForExcel

      this.$nextTick(() => {
        this.initChartTideLevel(this.pointProperties.KPIs[0].containerName, this.pointProperties.KPIs[0].completeContainerName, this.name, fechaInicial, fechaFinal, completeSerie)
        this.initChartEfficiency(this.pointProperties.KPIs[1].containerName, this.pointProperties.KPIs[1].completeContainerName, this.name, fechaInicial, fechaFinal, completeSerie)
      })
    },
    recoverInformationForTideSensor(fechaInicial, fechaFinal, completeSerie) {
      // Establish name of the sensor
      this.nameSensor = this.name + ' (' + this.longitudeSensor + ', ' + this.latitudeSensor + ')'
      //  Convert date to TimeStamp
      var aFecha = fechaFinal.split('-')
      var TimeStampFinal = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      var TimeStampInicial = null
      if (completeSerie) {
        TimeStampInicial = 0
      } else {
        aFecha = fechaInicial.split('-')
        TimeStampInicial = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      }
      // console.log(TimeStampInicial)
      // console.log(TimeStampFinal)
      var dataString =
      {
        'source': {
          'sourceId': 'urn:pixel:DataSource:frbod:TideSensorObserved'
        },
        'filters': [
          {
            'fieldName': 'name',
            'condition': 'matches',
            'value': this.name
          },
          {
            'fieldName': 'observed',
            'condition': 'greater',
            'value': TimeStampInicial
          },
          {
            'fieldName': 'observed',
            'condition': 'lower',
            'value': TimeStampFinal
          }
        ],
        'timeIntervals': [
          {
            'start': 0,
            'end': TimeStampFinal
          }
        ]
      }
      // console.log(dataString)
      dataExtractor(dataString).then(response => {
        // console.log('answer: ' + response)
        var arrSensors = response[0].records
        var arrX = []
        var arrY = []
        this.divider = arrSensors.length
        this.sumatory = 0
        var counterError = 0
        var listForExcel = []
        for (var counter = 0; counter <= arrSensors.length - 1; counter++) {
          if (parseInt(arrSensors[counter].data.water_height, 10) === 888) {
            counterError += 1
          } else {
            var convertToInteger = parseInt(arrSensors[counter].data.water_height, 10)
            var valueToSumatory = Number(convertToInteger / 100).toFixed(1)
            this.sumatory = this.sumatory + parseFloat(valueToSumatory)
            arrY.push(valueToSumatory)
            arrX.push(parseTime(arrSensors[counter].data.observed))
            // Items for Export to Excel
            var itemForExcel = {}
            itemForExcel.observed = parseTime(arrSensors[counter].data.observed)
            itemForExcel.water_height = valueToSumatory + 'm'
            itemForExcel.water_trend = arrSensors[counter].data.water_trend
            listForExcel.push(itemForExcel)
          }
        }
        this.dataError = counterError
        this.dataXTideSensor = arrX
        this.dataYTideSensor = arrY
        this.listForExcel = listForExcel

        this.$nextTick(() => {
          this.initChartTideLevel(this.name, fechaInicial, fechaFinal, completeSerie)
        })
      })// .catch(err => { console.log(err) })
    },
    initChartEfficiency(containerName, completeContainerName, sensorName, initialDate, endDate, completeSerie) {
      var countError = this.dataError / (this.divider)
      var errorPercentage = Number(countError).toFixed(4) * 100
      var measuresWithError = this.dataError
      var measuresWithoutError = this.divider - this.dataError
      var titleForChart = ''
      console.log('Porcentaje Error: ' + Number(errorPercentage).toFixed(2) + '%')
      if (completeSerie) {
        // this.chart = echarts.init(this.$refs['g2'], 'shine')
        this.chart = echarts.init(document.getElementById(completeContainerName), 'macarons')
        titleForChart = 'Complete serie: from ' + this.dataXTideSensor[0].substring(0, 10) + ' to ' + endDate
      } else {
        this.chart = echarts.init(document.getElementById(containerName), 'macarons')
        // this.chart = echarts.init(this.$refs['g1'], 'shine')
        titleForChart = 'From ' + initialDate + ' to ' + endDate
      }

      // this.chart = echarts.init(document.getElementById(containerName), 'macarons')
      titleForChart = 'From ' + initialDate + ' to ' + endDate
      this.chart.setOption({
        title: {
          text: titleForChart
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: [
            'Correct measures',
            'Measures with code 888'
          ]
        },
        series: [
          {
            name: 'Efficiency',
            type: 'pie',
            /* radius: '55%',
            center: ['50%', '60%'], */
            /* roseType: 'radius', */
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              {
                value: measuresWithoutError,
                name: 'Correct measures'
              },
              {
                value: measuresWithError,
                name: 'Measures with code 888'
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    initChartTideLevel(containerName, completeContainerName, sensorName, initialDate, endDate, completeSerie) {
      // console.log('Sumatory: ' + this.sumatory)
      // console.log('Divider: ' + this.divider)
      var medium = this.sumatory / (this.divider - this.dataError)
      medium = Number(medium).toFixed(2)
      // console.log('Medium: ' + medium)
      var source = sensorName + ' Tide Sensor'
      var titleForChart = ''
      if (completeSerie) {
        // this.chart = echarts.init(this.$refs['g2'], 'shine')
        this.chart = echarts.init(document.getElementById(completeContainerName), 'shine')
        titleForChart = 'Complete serie: from ' + this.dataXTideSensor[0].substring(0, 10) + ' to ' + endDate
      } else {
        this.chart = echarts.init(document.getElementById(containerName), 'shine')
        // this.chart = echarts.init(this.$refs['g1'], 'shine')
        titleForChart = 'From ' + initialDate + ' to ' + endDate
      }
      this.chart.setOption({
        title: {
          text: titleForChart
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 'center',
          bottom: 0,
          orient: 'horizontal',
          data: [source]
        },
        grid: {
          left: '6%',
          right: '2%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.dataXTideSensor
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: source,
            type: 'line',
            step: 'start',
            data: this.dataYTideSensor,
            color: 'green',
            markLine: {
              data: [
                // first line we want to draw
                [
                  {
                    xAxis: this.dataXTideSensor[0],
                    yAxis: medium,
                    symbol: 'none',
                    lineStyle: {
                      normal: {
                        color: 'red'
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: 'start',
                        formatter: medium
                      }
                    }
                  },
                  // end point of the line
                  {
                    xAxis: this.dataXTideSensor[this.dataXTideSensor.length - 1],
                    yAxis: medium,
                    symbol: 'none'
                  }
                ]
              ]
            }
          }
        ]
      })
    },
    closeInformation() {
      this.showInfo = false
    },
    assignIconByType(type) {
      var icon = ''
      switch (type) {
        case 'Complex Station':
          icon = require('../../assets/sensors/icon_station.svg')
          break
        case 'TideSensor':
          icon = require('../../assets/sensors/icon_tide.svg')
          break
        case 'Weather Sensor':
          icon = require('../../assets/sensors/icon_solar.svg')
          break
      }
      return icon
    },
    sumaFecha(d) {
      var Fecha = new Date()
      var sFecha = Fecha.getDate() + '-' + (Fecha.getMonth() + 1) + '-' + Fecha.getFullYear()
      var sep = sFecha.indexOf('/') !== -1 ? '/' : '-'
      var aFecha = sFecha.split(sep)
      var fecha = aFecha[2] + '-' + aFecha[1] + '-' + aFecha[0]
      fecha = new Date(fecha)
      fecha.setDate(fecha.getDate() + parseInt(d))
      var anno = fecha.getFullYear()
      var mes = fecha.getMonth() + 1
      var dia = fecha.getDate()
      mes = mes < 10 ? '0' + mes : mes
      dia = dia < 10 ? '0' + dia : dia
      //  var fechaFinal = dia + sep + mes + sep + anno
      var fechaFinal = anno + sep + mes + sep + dia
      return fechaFinal
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.map-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.info {
  padding: 10px;
  position: fixed;
  right: -25%;
  z-index: 1060;
  width: 25%;
  transition: right 0.2s, transform 0.2s;
}

.info2 {
  padding: 10px;
  position: fixed;
  top: -25%;
  right: 25%;
  z-index: 1060;
  width: 25%;
  transition: right 0.2s, transform 0.2s;
}

.active {
  right: 0%;
}
.negrita {
  font-weight: bold;
}
</style>
