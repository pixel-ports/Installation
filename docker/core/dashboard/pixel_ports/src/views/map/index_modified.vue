<template>
  <div id="app" class="map-container">
    <!-- first approach -->
    <!--<div id="map" style="width: 100%; height: 100%" />-->
    <!--<l-map
      ref="map"
    />-->
    <!-- second approach-->
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
    <!-- last approach -->
    <!--<l-map ref="map" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" />
      <l-geo-json :geojson="GEOJSON_FILE" />
    </l-map>-->
    <!-- :options="options"
    :attribution="attribution" -->
  </div>
</template>
<style href="http://unpkg.com/leaflet@1.4.0/dist/leaflet.css"></style>
<script src="./L.KML.js"></script>
<script src="./layer/vector/KML.js"></script>
<script>
// import waves from '@/directive/waves' // waves directive
// import resize from '@/components/widget/mixins/resize'
import { LMap, LTileLayer, LControlLayers, LGeoJson } from 'vue2-leaflet'
import { KMZParser } from 'leaflet-kmz'
import L from 'leaflet'
import { latLng } from 'leaflet'
import kmlfile from './L.KML.js'

// Is highly suggested to import only the needed modules by doing so:

import search from 'leaflet-search' // eslint-disable-line no-unused-vars
import 'leaflet-search/src/leaflet-search.css'
import geoLayer from './geojson.json' //it works fine
// import geoLayer from './geo.geojson'

//import fichero from '../../assets/ThPA_KML.KML'
//import data2 from '../../assets/ThPA_KML.KML'
// import kmz from './ThPA_KML.KML'
// import { m } from 'leaflet-plugins'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

// NUEVOS IMPORTS PARA NUEVA PRUEBA
import { kml } from '@tmcw/togeojson'

var tj = require('togeojson')
var fs = require('fs')
var DOMParser = require('xmldom').DOMParser
// node doesn't have xml parsing or a dom. use xmldom
// var DOMParser = require('xmldom').DOMParser
const provider = new OpenStreetMapProvider()
//import geoXML3 from 'evoweb-geoxml3'
import axios from 'axios'
//const DOMParser = require('xmldom').DOMParser
const parseKML = require('parse-kml')

//--
const kmlParse = require('kml-parse')
//const fs = require('fs-extra')
//-

import { getGeoJSONForAirDispersionModel } from '@/api/PAS_IH'

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LGeoJson
  },
  // directives: { waves },
  // mixins: [resize],
  props: {},
  data() {
    return {
      // geojson: geoLayer,
      // GEOJSON_FILE: null,
      geoFichero: null,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      pointProperties: null,
      nameSensorAndLocation: '',
      activeName: '1',
      tabPosition: 'right',
      widgetsDialog: false, // Dialog with drawer for widgets
      downloadLoading: false, // Export to excel
      //center: latLng(44.85738, -0.54725645),//Bordeaux
      center: latLng(40.61056, 22.908897),//Thesaloniki
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
      peticion1: []
    }
  },
  computed: {
    GEOJSON_FILE() {
      return geoLayer
      //return fichero
      // var bitmap = fs.readFileSync(geoLayer, 'utf-8')

      // var bitmap = fs.readFileSync('./ThPA_KML.KML') /
      // console.log(bitmap)
      // var kml = new DOMParser().parseFromString(fs.readFileSync('./ThPA_KML.KML', 'utf8'))
      // console.log(kml)
      // return ''
      // const kml = new DOMParser().parseFromString(geoLayer)

      // const converted = tj.kml(kml)

      // const convertedWithStyles = tj.kml(kml, { styles: true })

      // return convertedWithStyles
    }
  },
  watch: {

  },
  mounted() {
    //console.log(data2)
    this.$nextTick(() => {
      // this.firstApproach()
       //this.secondApproach()
      // this.thirdApproach()
       //this.fourthApproach()//with DIV
       //this.applyGeoJSON()
       this.windy()// works with DIV
      //this.fifth()
      //this.readFile()//work problem with lecture of file DIV
    //this.leaflet_kmz()//work problem with proxy DIV
    })
  },
  beforeDestroy() {

  },
  created() {
    /* const response = await fetch('https://rawgit.com/gregoiredavid/france-geojson/master/regions/pays-de-la-loire/communes-pays-de-la-loire.geojson')

    this.GEOJSON_FILE = await response.json()*/

    /* const response = await fetch('./geojson.json')
    this.GEOJSON_FILE = await response*/
  },
  methods: {
    leaflet_kmz() {
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

      var kmz = L.kmzLayer().addTo(map)

      kmz.on('load', function(e) {
        control.addOverlay(e.layer, e.name)
        //e.layer.addTo(map);
      })

      var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      regionsUrl = 'https://raruto.github.io/leaflet-kmz/examples/regions.kmz',
      capitalsUrl = 'https://raruto.github.io/leaflet-kmz/examples/capitals.kmz',
      globeUrl = 'https://raruto.github.io/leaflet-kmz/examples/globe.kmz',
      thesaloniki = 'https://github.com/JAClemente/JAClemente.github.io/raw/master/ThPA_KML.KML'
      //thesaloniki = 'https://github.com/JAClemente/JAClemente.github.io/blob/master/ThPA_KML.KML'

      kmz.load(proxyUrl + regionsUrl)
      kmz.load(proxyUrl + capitalsUrl)
      kmz.load(proxyUrl + globeUrl)
      kmz.load(proxyUrl + thesaloniki)

      console.log('Jose')
      console.log(kmz)

      var control = L.control.layers(null, null, { collapsed:true }).addTo(map)
      //var control = L.control.layers(null, { 'Track': kmz}, { collapsed:false }).addTo(map)
    },
    readFile() {

      //var kml = new DOMParser().parseFromString(fs.readFileSync('ThPA_KML.KML', 'utf8'))
      //var kml = new DOMParser().parseFromString('ThPA_KML.KML', 'UTF-8')
      var kml = new DOMParser().parseFromString('ThPA_KML.KML', 'application/xml')
      //var kml = new DOMParser().parseFromString(this.GEOJSON_FILE, 'UTF-8')

      //console.log(kml)
      var converted = tj.kml(kml)
      //console.log(converted)
      var convertedWithStyles = tj.kml(kml, { styles: true })
      //console.log(convertedWithStyles)

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
        // POIs con contorno
        /*getGeoJSONForAirDispersionModel('area_sources').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //solo contorno
        getGeoJSONForAirDispersionModel('barriers').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })
        //solo contorno
        getGeoJSONForAirDispersionModel('buildings').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })
        //features 0 no es representativa
        /*getGeoJSONForAirDispersionModel('contours').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //contorno
        getGeoJSONForAirDispersionModel('contours_horizontal').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })
        //un POI
        /*getGeoJSONForAirDispersionModel('gps_points').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //una capa con 2080 puntos no hay que agregarla
        /*getGeoJSONForAirDispersionModel('grids').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //ningun elemento en esta feature
        /*getGeoJSONForAirDispersionModel('items').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //21 features con diversos points
        /*getGeoJSONForAirDispersionModel('line_sources').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //39 features con POIs
        /*getGeoJSONForAirDispersionModel('point_sources').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/
        //10 features POIs
        /*getGeoJSONForAirDispersionModel('receivers').then(response => {
          console.log('Salida de getGeoJSONForAirDispersionModel')
          console.log(response)
          L.geoJSON(response).addTo(map)
        })*/

    },
    fifth() {
      var map = L.map('map', {
        preferCanvas: true // recommended when loading large layers.
      })
      map.setView(new L.LatLng(43.5978, 12.7059), 5)

      var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        opacity: 0.90
      })
      OpenTopoMap.addTo(map)

      var kmz = L.kmzLayer().addTo(map)

         kmz.on('load', function(e) {
          control.addOverlay(e.layer, e.name)
          // e.layer.addTo(map);
        });
      var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      targetUrl = 'https://github.com/JAClemente/JAClemente.github.io/raw/master/ThPA_KML.KML'
      // Add remote KMZ files as layers (NB if they are 3rd-party servers, they MUST have CORS enabled)
      kmz.load(proxyUrl + targetUrl)
      //kmz.load('../ThPA_KML.KML')

      var control = L.control.layers(null, null, { collapsed:false }).addTo(map)

    },
    fourthApproach() {
      var map = L.map('map', {
        center: [40.61056, 22.908897],
        zoom: 13
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

      //const parser = new DOMParser()
      //const kml = parser.parseFromString('ThPA_KML.KML', 'text/xml')
      //debugger;
      var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      targetUrl = 'https://github.com/JAClemente/JAClemente.github.io/raw/master/ThPA_KML.KML'
      var track = new L.KML(proxyUrl + targetUrl, { async: true, styles: true})// , styles: true
      .on('loaded', function(e) {
        map.fitBounds(e.target.getBounds())
      }).addTo(map)
      console.log(track)
      L.control.layers(null, { 'Track': track}, { collapsed: false }).addTo(map)
    },
    windy() {
      //const map = this.$refs.map.mapObject
      const map = this.$refs.map.mapObject
      /*var map = L.map('map', {
        center: [40.61056, 22.908897],
        zoom: 13
      })*/

      //const osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      //map.addLayer(osm)

      /*this.tileProviders.forEach(layer => {
        L.tileLayer(layer.url).addTo(map)
      })*/

      var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      targetUrl = 'https://github.com/JAClemente/JAClemente.github.io/raw/master/ThPA_KML.KML'
      //targetUrl = 'https://cloud.prodevelop.es/index.php/s/dMirbfHSkyzJ9Rn'

      //fetch('https://github.com/Djenh/KML-files/blob/master/Villages.kml')
      fetch(proxyUrl + targetUrl)
      //fetch('../src/assets/ThPA_KML.KML', { mode: 'no-cors'})
        .then(res => res.text())
        .then(kmltext => {
          //debugger;
          // Create new kml overlay
          const parser = new DOMParser()
          const kml = parser.parseFromString(kmltext, 'text/xml')
          //debugger;
          const track = new L.KML(kml, { styles: true, async: true })//styles es un injerto de newApproach
          console.log(track._layers)
          //debugger;
          var tt
          track.eachLayer(function(layer) {
            console.log(layer.options.name)
            if (layer.options.name === "Contours") {
              tt = layer
            }
          })

          map.addLayer(tt)

          const bounds = tt.getBounds()
          //console.log(bounds)
          map.fitBounds(bounds)
          L.control.layers(null, { 'Track': tt}, { collapsed: false }).addTo(map)

        })
//, { async: true}
    },
    applyGeoJSON() {

      const map = this.$refs.map.mapObject
      L.geoJSON(geoLayer).addTo(map)
    },
    thirdApproach() {
      const map = this.$refs.map.mapObject
      const control = L.control.layers(null, null, { collapsed: false }).addTo(map)
      const kmzParser = new KMZParser({
        onKMZLoaded: function(layer, name) {
          control.addOverlay(layer, name)
          layer.addTo(map)
        }
      })
      kmzParser.load('../ThPA_KML.KML')
      kmzParser.load('../capitals.kmz')
    },
    secondApproach() {
      const map = this.$refs.map.mapObject
      const control = L.control.layers(null, null, { collapsed: true }).addTo(map)
      console.log('Jeronimo')
      /*const kmzParser = new L.KMZParser({
        onKMZLoaded: function(layer, name) {
          control.addOverlay(layer, name)
          layer.addTo(map)
        }
      })
      kmzParser.load('../ThPA_KML.KML')*/

       var kmz = L.kmzLayer().addTo(map)

       kmz.on('load', function(e) {
       control.addOverlay(e.layer, e.name)
        //e.layer.addTo(map)
       })

      // Add remote KMZ files as layers (NB if they are 3rd-party servers, they MUST have CORS enabled)
       kmz.add('ThPA_KML.KML')
       //kmz.load('ThPA_KML.KML')
       kmz.add('capitals.kmz')

       //L.control.layers(null, kmz, { collapsed: false }).addTo(map)//added

      // const control = L.control.layers(null, null, { collapsed: false }).addTo(map)
    },
    firstApproach() {
      var map = L.map('map', {
        center: [43.5978, 12.7059],
        zoom: 13,
        mapTypeId: 'topo',
        gestureHandling: false,
        searchControl: false,
        locateControl: false,
        pegmanControl: false,
        fullscreenControl: false,
        minimapControl: false,
        preferCanvas: true, // recommended when loading large layers.
        plugins: [
          '@raruto/leaflet-elevation@1.3.x/dist/leaflet-elevation.css',
          '@raruto/leaflet-elevation@1.3.x/dist/leaflet-elevation.js'
        ]
      })
      // map.setView(new L.LatLng(44.85738, -0.54725645), 13)

      /* var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        opacity: 0.90
      })
      OpenTopoMap.addTo(map)*/

      // Instantiate KMZ layer (async)
      // var kmz = L.kmzLayer().addTo(map)
      var kmz = L.kmzLayer(null, {

      }).addTo(map)

      kmz.on('load', function(e) {
        control.addOverlay(e.layer, e.name)
        // e.layer.addTo(map)
      })

      // Add remote KMZ files as layers (NB if they are 3rd-party servers, they MUST have CORS enabled)
      // kmz.add('../ThPA_KML.KML')
      kmz.load('../ThPA_KML.KML')

      var control = L.control.layers(null, null, { collapsed: false }).addTo(map)
    }
  }
}
</script>

<style lang="scss" scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}
.map-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
