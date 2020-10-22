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
        v-for="data in sensorsObject"
        :key="data.layer_id"
        :name="data.layer_name"
        layer-type="overlay"
      >
        <l-marker
          v-for="mark in data.sensors"
          :key="mark.name"
          :lat-lng="[mark.location.lon, mark.location.lat]"
          @click="markClick(mark)"
        >
          <l-icon :icon-anchor="[22, 45]" :icon-size="[45, 43]">
            <img :src="assignIconByType(data.layer_name)">
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
                  <strong>{{ mark.location.lon }}</strong>
                </li>
                <li>
                  <span>{{ $t('map.latitude') }}</span>
                  <strong>{{ mark.location.lat }}</strong>
                </li>
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

<script>
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

import { getSourcesFromPort, ListSensorByIdSource } from '@/api/dataextractor_IH'

import pixelConstants from '@/utils/constants' // import class for constants

import { getSensors } from '@/api/dataextractor_IH'

const provider = new OpenStreetMapProvider()

import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LFeatureGroup,
    LTooltip,
    LIcon
  },
  directives: { waves },
  mixins: [resize],
  props: {},
  data() {
    return {
      zoom: 13,
      sensorsCollection: [],
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
      sensorsObject: []
    }
  },
  watch: {
    lang() {
      this.setOptions()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDevicesFromPort()
      /* this.sensorsObject = this.sensorsCollection
      this.addLegend()*/
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
    getDevicesFromPort() {
      var features = []
      getSourcesFromPort().then(response => {
        // console.log(response)
        var id_layer = 1
        var items = {
          layers: []
        }
        response.forEach(obj => {
          if (obj.sourceTypeId.includes(pixelConstants.SENSOR)) {
            // console.log('Es un sensor')
            var aSensorType = obj.sourceId.split(':')
            var itemSensors = {
              'ID': obj.sourceTypeId,
              'sourceId': obj.sourceId,
              'layer_name': aSensorType[1],
              'layer_id': id_layer,
              'sensors': []
            }
            ListSensorByIdSource(obj.sourceTypeId).then(response => {
              var index = 0
              response.forEach(it => {
                if (it.data.location) {
                  var itemSensor = {
                    'name': it.data.name,
                    'type': aSensorType[1],
                    'location': it.data.location,
                    'dataProvider': it.data.dataProvider,
                    'observed': this.convertToDate(it.data.observed),
                    'timestamp': this.convertToDate(it.timestamp),
                    'index': index,
                    'selected': false,
                    'source': obj.sourceId,
                    'KPIs': this.addKPIsBySensor(aSensorType[1])
                  }
                  index = index + 1
                  // sensores.push(itemSensor)

                  itemSensors.sensors.push(itemSensor)
                  var featuresItem = {
                    'type': 'Feature',
                    'properties': {
                      'name': it.data.name
                    },
                    'geometry': {
                      'type': 'Point',
                      'coordinates': [
                        it.data.location.lat,
                        it.data.location.lon
                      ]
                    }
                  }
                  features.push(featuresItem) // Object to look for location in the map
                }
              })
            })
            id_layer = id_layer + 1
            this.sensorsCollection.push(itemSensors)
            this.sitec =
            {
              'type': 'FeatureCollection',
              'features': features
            }
            // console.log(this.sitec)
            // this.addSearchBar()
            this.sensorsObject = this.sensorsCollection
            items.layers = this.sensorsObject
            this.addLegend(items)
          }
        })
        // this.addSearchBar()
      })
    },
    convertToDate(timestamp) {
      var theDate = new Date(timestamp)
      return theDate
      // console.log(theDate)
    },
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
        debugger
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
    loadIcons(layerName, icons) {
      var icon = ''
      switch (layerName) {
        case 'TideSensor':
          icon = 'icon_tide'
          break
        case 'WeatherSensor':
          icon = 'icon_solar'
          break
      }
      icons.push(icon)
      return icons
    },
    addLegend(items) {
      var legendTitle = this.titleLegend
      const map = this.$refs.map.mapObject // referencia al objeto mapa de vue2-leaflet
      // Insertando una leyenda en el mapa
      var categories = []
      var icons = []
      items.layers.forEach(layer => {
        if (layer.layer_name.includes(pixelConstants.SENSOR)) {
          categories.push(layer.layer_name)
          icons = this.loadIcons(layer.layer_name, icons)
        }
      })
      var legend = new window.L.Control({ position: 'bottomright' })
      legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info-legend')
        var labels = ['<strong>' + legendTitle + '</strong>']
        // var categories = ['Tide Sensor'] // , 'Weather Sensor']
        // 'icon_station',
        // var icons = ['icon_tide'] // , 'icon_solar']
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
      this.recoverInformationFromSpecificSensor(this.pointProperties.type, this.pointProperties.source, this.name, fechaInicial, fechaFinal, true)
      this.widgetsDialog = false
      this.dialogCompleteSerie = true
    },
    markClick(mark) {
      // Assign the specific POI to pointProperties
      this.pointProperties = mark
      //  Establish name
      this.name = mark.name
      this.longitudeSensor = mark.location.lon
      this.latitudeSensor = mark.location.lat
      this.nameSensorAndLocation = mark.type + ': ' + this.name + ' (' + this.longitudeSensor + ', ' + this.latitudeSensor + ')'
      // Filtering by one week
      var fechaFinal = this.sumaFecha(0)
      var fechaInicial = this.sumaFecha(-7)
      this.recoverInformationFromSpecificSensor(mark.type, mark.source, this.name, fechaInicial, fechaFinal, false)
      this.widgetsDialog = true
    },
    toTimestamp(year, month, day, hour, minute, second) {
      var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      return datum.getTime()// / 1000
    },
    recoverInformationFromSpecificSensor(typeSensor, source, name, start, end, completeSerie) {
      var operador = pixelConstants.OPERATORS_IH_MATCHES

      var aFecha = end.split('-')
      var TimeStampFinal = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      var TimeStampInicial = null
      if (completeSerie) {
        TimeStampInicial = 0
      } else {
        aFecha = start.split('-')
        TimeStampInicial = this.toTimestamp(aFecha[0], aFecha[1], aFecha[2], 0, 0, 0)
      }
      TimeStampInicial = 1575162000
      TimeStampFinal = 1599523200000
      getSensors(source, operador, name, TimeStampInicial, TimeStampFinal).then(response => {
        console.log(response)
        if (typeSensor === 'TideSensor') {
          this.prepareDataForTideSensor(response, start, end, completeSerie)
        }
      })
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
        case 'TideSensorObserved':
          icon = require('../../assets/sensors/icon_tide_green.svg')
          break
        case 'TideSensor':
          icon = require('../../assets/sensors/icon_tide.svg')
          break
        case 'pixel':
          icon = require('../../assets/sensors/icon_tide.svg')
          break
        case 'Weather Sensor':
          icon = require('../../assets/sensors/icon_solar.svg')
          break
        default:
          icon = require('../../assets/sensors/icon_tide.svg')
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
