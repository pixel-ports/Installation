<template>
  <div class="map" :style="{ height: height, width: width }" />
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
// import resize from '../mixins/resize'
// import { debounce } from '@/utils'

require('leaflet.markercluster')
require('leaflet.markercluster.layersupport')

export default {
  name: 'TrafficMapUpv',
  // mixins: [resize],
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
          formTrafficUPV: {
            lowerThreshold: null,
            upperThreshold: null
          }
        }
      }
    }
  },
  data() {
    return {
      gatesData: [{
        id: 'TrafficFlowObservedPIXEL-THPA-gate10A',
        type: 'TrafficFlowObservedPIXEL',
        laneId: 'Point',
        address: {
          streetAddress: 'Paraskevi',
          addressLocality: 'Thessaloniki',
          addressCountry: 'GR'
        },
        location: {
          type: 'Point',
          coordinates: [40.643685, 22.910026]
        },
        dateObservedFrom: '2019-12-07T08:00:00Z',
        dateObservedTo: '2019-12-07T09:00:00Z',
        intensity: 100
      },
      {
        id: 'TrafficFlowObservedPIXEL-THPA-gate16',
        type: 'TrafficFlowObservedPIXEL',
        laneId: 'Point',
        address: {
          streetAddress: 'Paraskevi',
          addressLocality: 'Thessaloniki',
          addressCountry: 'GR'
        },
        location: {
          type: 'Point',
          coordinates: [40.640485, 22.922926]
        },
        dateObservedFrom: '2019-12-07T08:00:00Z',
        dateObservedTo: '2019-12-07T09:00:00Z',
        intensity: 250
      }],
      map: null,
      mapConfig: {
        mapCenter: [40.639485, 22.922926],
        zoomLevel: 14,
        icon: {
          default: require('leaflet/dist/images/marker-icon.png')
        },
        iconShadow: require('leaflet/dist/images/marker-shadow.png'),
        iconRetina: require('leaflet/dist/images/marker-icon-2x.png'),
        layers: {
          baseMaps: {
            OpenStreetMap: L.tileLayer(
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom: 18
              }
            )
          },
          overlayMaps: {}
        }
      },
      mapGatesLayer: null
    }
  },
  mounted() {
    this.drawMap()
  },
  methods: {
    drawMap() {
      // const self = this
      if (screen.width < 600) this.mapConfig.zoomLevel = 13
      this.map = L.map(this.$el, { zoomControl: false }).setView(this.mapConfig.mapCenter, this.mapConfig.zoomLevel)
      this.mapConfig.layers.baseMaps.OpenStreetMap.addTo(this.map)

      if (this.filtered.formTrafficUPV.lowerThreshold || this.filtered.formTrafficUPV.upperThreshold) {
        const legend = L.control({ position: 'bottomright' })

        legend.onAdd = () => {
          const div = L.DomUtil.create('div', 'infomap maplegend')
          div.innerHTML += '<i style="background: green"></i>Low Congestion<br>'
          div.innerHTML += '<i style="background: yellow"></i>Medium Congestion<br>'
          div.innerHTML += '<i style="background: red"></i>High Congestion<br>'
          return div
        }
        legend.addTo(this.map)
      }

      this.mapGatesLayer = L.featureGroup()

      this.gatesData.forEach(gate => {
        L.circle(gate.location.coordinates, {
          color: this.getCongestionLevel(gate.intensity),
          fillColor: this.getCongestionLevel(gate.intensity),
          fillOpacity: 0.5,
          radius: 100,
          gate: gate.id
        })
          .addTo(this.mapGatesLayer)
          .bindPopup(gate.id + ': traffic between ' + gate.dateObservedFrom + ' and ' + gate.dateObservedTo + ' is ' + gate.intensity + ' cars')
      })

      this.map.addLayer(this.mapGatesLayer)
    },
    getCongestionLevel(value) {
      // console.log(value)
      // console.log(this.filtered.lowerThreshold)
      // console.log(this.filtered.upperThreshold)
      if (value > this.filtered.formTrafficUPV.upperThreshold) return 'red'
      else if (value < this.filtered.formTrafficUPV.lowerThreshold) return 'green'
      else return 'yellow'
    }
  }
}
</script>

<style>
.map {
  /* width: 100%; */
  /* height: 100%; */
  /* min-height: 325px; */
  overflow: hidden;
  z-index: 0;
}

.leaflet-marker-selected {
  z-index: 9999;
}

.infomap {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: rgba(255,255,255,0.8);
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  border-radius: 5px;
}

.maplegend {
  line-height: 18px;
  color: #555;
}
.maplegend i {
  width: 15px;
  height: 15px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

/* @media (max-width: 600px) {
  .map {
    min-height: 350px;
  }
} */
</style>
