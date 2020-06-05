<template>
  <div :style="{height:height,width:width}" />
</template>
<!--:class="className" -->
<script>
import { getETD } from '@/api/dataextractor_IH'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
import { dateFormatterToString, timeSinceMinutes } from '@/utils/common'

import { debounce } from '@/utils'
// const animationDuration = 6000
const HEIGHT_RATIO = 0.6
const DIM_CATEGORY_INDEX = 0
const DIM_TIME_ARRIVAL_DOCK = 1
const TIME_PIXEL_ETD = 2
const TIME_DEPARTURE_DOCK = 3
const _cartesianXBounds = []
const _cartesianYBounds = []
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
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
          field: 'arrival_dock'
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
      chart: null,
      data: []
    }
  },
  mounted() {
    getETD(this.filtered.field, this.filtered.start, this.filtered.end).then(response => {
      this.data = this.formatToETD(response[0].records)

      this.$nextTick(() => {
        this.initChart()
      })
    })

    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    formatToETD(data_raw) {
      var objectVCall = []
      for (let i = 0; i < data_raw.length; i++) {
        const element = data_raw[i]
        var data = element.data
        if (data && data.pixel_etd) {
          var foundIndex = null
          for (let j = 0; j < objectVCall.length && !foundIndex; j++) {
            const subElement = objectVCall[j]
            if (subElement[4] === data.name) {
              foundIndex = j
            }
          }
          if (foundIndex) {
            objectVCall.push([foundIndex, data.arrival_dock, data.pixel_etd, data.departure_dock, data.name, dateFormatterToString(data.arrival_dock), dateFormatterToString(data.pixel_etd), dateFormatterToString(data.departure_dock), timeSinceMinutes(data.pixel_etd, data.departure_dock)])
          } else {
            objectVCall.push([objectVCall.length + 1, data.arrival_dock, data.pixel_etd, data.departure_dock, data.name, dateFormatterToString(data.arrival_dock), dateFormatterToString(data.pixel_etd), dateFormatterToString(data.departure_dock), timeSinceMinutes(data.pixel_etd, data.departure_dock)])
          }
        }
      }

      return {
        dimensions: [
          'id',
          'arrival_data',
          'etd_data',
          'departure_data',
          'Name',
          'Arrival dock',
          'Pixel ETD',
          'Departure dock',
          'Diff'
        ],
        data: objectVCall
      }
    },
    renderGanttItem(params, api) {
      var categoryIndex = api.value(DIM_CATEGORY_INDEX)

      var date1 = null
      var date2 = null
      var color = '#900'
      var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL_DOCK), categoryIndex])

      if (!api.value(TIME_DEPARTURE_DOCK)) {
        date1 = api.value(TIME_PIXEL_ETD)
        date2 = api.value(TIME_PIXEL_ETD)
        color = '#090'
      } else if (api.value(TIME_PIXEL_ETD) < api.value(TIME_DEPARTURE_DOCK)) {
        date1 = api.value(TIME_PIXEL_ETD)
        date2 = api.value(TIME_DEPARTURE_DOCK)
      } else {
        date1 = api.value(TIME_DEPARTURE_DOCK)
        date2 = api.value(TIME_PIXEL_ETD)
        color = '#090'
      }

      var timeDeparture = api.coord([date1, categoryIndex])
      var diferencePercentaje = (date1 - api.value(DIM_TIME_ARRIVAL_DOCK)) * 100 / (date2 - api.value(DIM_TIME_ARRIVAL_DOCK))
      var coordSys = params.coordSys
      _cartesianXBounds[0] = coordSys.x
      _cartesianXBounds[1] = coordSys.x + coordSys.width
      _cartesianYBounds[0] = coordSys.y
      _cartesianYBounds[1] = coordSys.y + coordSys.height

      var barLength = timeDeparture[0] - timeArrival[0]
      // Get the heigth corresponds to length 1 on y axis.
      var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO
      var x = timeArrival[0]
      var y = timeArrival[1] - barHeight

      var flightNumber = api.value(4) + ''
      var flightNumberWidth = echarts.format.getTextRect(flightNumber).width
      var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
        ? flightNumber : ''

      var rectNormal = this.clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
      })

      var barLenghtFinal = (barLength / 100) * diferencePercentaje > barLength ? barLength : (barLength / 100) * diferencePercentaje
      var rectVIP = this.clipRectByRect(params, {
        x: x, y: y, width: barLenghtFinal, height: barHeight
      })
      var rectText = this.clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
      })

      return {
        type: 'group',
        children: [{
          type: 'rect',
          ignore: !rectNormal,
          shape: rectNormal,
          style: api.style({ fill: color })
        }, {
          type: 'rect',
          ignore: !rectVIP && !api.value(4),
          shape: rectVIP,
          style: api.style()
        }, {
          type: 'rect',
          ignore: !rectText,
          shape: rectText,
          style: api.style({
            fill: 'transparent',
            stroke: 'transparent',
            text: text,
            textFill: '#fff'
          })
        }]
      }
    },
    clipRectByRect(params, rect) {
      return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({ tooltip: {
      },
      toolbox: {
        left: 20,
        top: 0,
        itemSize: 20
      },
      responsive: false,
      maintainAspectRatio: true,
      showScale: false,
      animation: false,
      dataZoom: [{
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        height: 20,
        bottom: 0,
        start: 100 - (70 * 100 / this.data.data.length),
        end: 100,
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        showDetail: false
      }, {
        type: 'inside',
        id: 'insideX',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        start: 100 - (70 * 100 / this.data.data.length),
        end: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      }, {
        type: 'slider',
        yAxisIndex: 0,
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        width: 20,
        right: 0,
        top: 70,
        bottom: 20,
        start: 100 - (70 * 100 / this.data.data.length),
        end: 100,
        handleSize: '80%',
        showDetail: false
      }, {
        type: 'inside',
        id: 'insideY',
        yAxisIndex: 0,
        start: 100 - (70 * 100 / this.data.data.length),
        end: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      }],
      grid: {
        show: true,
        top: 50,
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: '#fff',
        borderWidth: 0
      },
      xAxis: {
        type: 'time',
        position: 'top',
        splitLine: {
          lineStyle: {
            color: ['#E9EDFF']
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            color: '#929ABA'
          }
        },
        axisLabel: {
          color: '#929ABA',
          inside: false,
          align: 'center'
        }
      },
      yAxis: {
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        min: 0,
        max: this.data.data.length + 1
      },
      series: [{
        id: 'flightData',
        type: 'custom',
        renderItem: this.renderGanttItem,
        dimensions: this.data.dimensions,
        encode: {
          x: [DIM_TIME_ARRIVAL_DOCK, TIME_PIXEL_ETD],
          y: DIM_CATEGORY_INDEX,
          tooltip: [5, 6, 7, 8, 4]
        },
        data: this.data.data
      }] })
    }
  }
}
</script>
