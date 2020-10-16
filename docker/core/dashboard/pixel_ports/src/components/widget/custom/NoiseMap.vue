<template>
  <div class="map-container">
    <l-map
      ref="map"
      class="map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
    >
      <l-control-layers position="bottomleft" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :url="tileProvider.url"
        :visible="tileProvider.visible"
        layer-type="base"
      />
    </l-map>
  </div>
</template>

<script>

import L from 'leaflet'
import { latLng } from 'leaflet'
import kmlfile from './L.KML.js'
import search from 'leaflet-search' // eslint-disable-line no-unused-vars
import 'leaflet-search/src/leaflet-search.css'
import {
  LMap,
  LTileLayer,
  LControlLayers
} from 'vue2-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

import { getPaoloVisualization } from '@/api/PAS_IH'

const provider = new OpenStreetMapProvider()

require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'NoiseMap',
  components: {
    LMap,
    LTileLayer,
    LControlLayers
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
          source: ''
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
      zoom: 13,
      center: latLng(39.4458333, -0.32), // Puerto Valencia
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
      console.log('Before to error')
      this.LoadURLForNoiseMap()
      //this.testPaolo()
    })
  },
  beforeDestroy() {},
  methods: {
    testPaolo() {
      getPaoloVisualization('sample1').then(response => {
        console.log('Salida de getPaoloVisualization')
        console.log(response)
      })
    },
    LoadURLForNoiseMap() {
      var execution = false
      // console.log(this.filtered.source)
      if (this.filtered.source !== '') {
        execution = true
      } else {
      // mapa inicial para pantalla intermedia
      }

      if (execution) {
        const map = this.$refs.map.mapObject
        // this.center = this.obtainMapCenter('GR_SKG')
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        fetch(proxyUrl + this.filtered.source)
          .then(res => res.text())
          .then(kmltext => {
            const parser = new DOMParser()
            const kml = parser.parseFromString(kmltext, 'text/xml')

            const track = new L.KML(kml, { styles: true, async: true })
            var itemLayer
            track.eachLayer(function(layer) {
              // console.log(layer.options.name)
              if (layer.options.name === 'Contours') {
                itemLayer = layer
              }
            })
            map.addLayer(itemLayer)

            const bounds = itemLayer.getBounds()

            map.fitBounds(bounds)
            L.control.layers(null, { 'Noise Layer': itemLayer }, { collapsed: false }).addTo(map)
          })
      }
    },
    get() {
      var map = L.map('map', {
        preferCanvas: true // recommended when loading large layers.
      })

      map.setView(new L.LatLng(40.61056, 22.908897), 11)
      var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        opacity: 0.90
      })
      OpenTopoMap.addTo(map)
    },
    getDataForMap() {
      var execution = false

      if (this.filtered.source !== '') {
        console.log('Hola!!')
        console.log(this.filtered.source)
        execution = true
      } else {
      // mapa inicial para pantalla intermedia
      }

      if (execution) {
        this.center = this.obtainMapCenter('GR_SKG')
        getGeoJSONForAirDispersionModel(this.filtered.source).then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          const map = this.$refs.map.mapObject
          L.geoJSON(response).addTo(map)
        })
      }
    },
    obtainMapCenter(sourceId) {
      console.log(sourceId)
      var arrLOCODE = sourceId.split(':')
      var center
      switch (arrLOCODE[0]) {
        case 'FR_BOD':
          center = latLng(44.85738, -0.54725645)// OK
          break
        case 'GR_PIR':
          center = latLng(44.85738, -0.54725645)
          break
        case 'GR_SKG':
          center = latLng(40.61056, 22.908897)// OK
          break
        case 'IT_MNF':
          center = latLng(44.85738, -0.54725645)
          break
      }
      return center
    }
  }
}
</script>
