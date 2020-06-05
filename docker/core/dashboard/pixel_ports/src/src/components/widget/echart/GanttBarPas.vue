<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getInstance } from '@/api/otools'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
import { debounce } from '@/utils'
import { dateFormatterToString } from '@/utils/common'
const hard = require('./pas2.json')
// const animationDuration = 6000
const HEIGHT_RATIO = 0.6
const DIM_CATEGORY_INDEX = 0
const DIM_TIME_ARRIVAL_DOCK = 1
const DIM_TIME_DEPARTURE_DOCK = 2
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
          id: [
            {
              'modelId': 'hard1',
              'executionId': 'hard1'
            }
          ]
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
      data: [],
      dataIndex: []
    }
  },
  mounted() {
    // TODO: Quitar esto
    if (this.filtered.id[0].executionId === 'hard1') {
      this.formatToPAS(hard[0].ships_list)
      this.$nextTick(() => {
        this.initChart()
      })
    } else {
      getInstance({ id: this.filtered.id[0].executionId }).then(response => {
        this.formatToPAS(response.result[0].ships_list)
        this.$nextTick(() => {
          this.initChart()
        })
      })
    }

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
    formatToPAS(data_raw) {
      var objectVCall = []
      var objectVCallIndex = []

      for (let i = 0; i < data_raw.length; i++) {
        const element = data_raw[i]
        const label = decodeURI(element.label)
        objectVCallIndex.push([i, label])
        if (element.stopovers_list && element.stopovers_list.length) {
          for (let j = 0; j < element.stopovers_list.length; j++) {
            const hand = element.stopovers_list[j].handlings_list[0]

            if (hand.dock && hand.dock.ETA && hand.dock.ETD) {
              objectVCall.push([i, hand.dock.ETA, hand.dock.ETD, label, hand.activities_list.length, dateFormatterToString(hand.dock.ETA), dateFormatterToString(hand.dock.ETD)])
            }
          }
        }
      }
      this.data = {
        dimensions: [
          'id',
          'arrival_dock',
          'departure_dock',
          'Name',
          'Steps',
          'Arrival dock',
          'Departure dock'
        ],
        data: objectVCall
      }

      this.dataIndex = {
        dimensions: [
          'id',
          'name'
        ],
        data: objectVCallIndex
      }
    },
    renderGanttItem(params, api) {
      var categoryIndex = api.value(DIM_CATEGORY_INDEX)
      var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL_DOCK), categoryIndex])
      var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE_DOCK), categoryIndex])

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

      var rectNormal = this.clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
      })

      return {
        type: 'group',
        children: [{
          type: 'rect',
          ignore: !rectNormal,
          shape: rectNormal,
          style: api.style()
        }]
      }
    },
    renderAxisLabelItem(params, api) {
      var y = api.coord([0, api.value(0)])[1]
      if (y < params.coordSys.y + 5) {
        return
      }
      return {
        type: 'group',
        position: [
          10,
          y
        ],

        children: [{
          type: 'text',
          style: {
            x: 17,
            y: -2,
            textVerticalAlign: 'bottom',
            textAlign: 'right',
            text: api.value(2),
            textFill: '#000'
          }
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
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Name']
      },
      toolbox: {
        left: 20,
        top: 0,
        itemSize: 20
      },
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
        id: 'dockData',
        type: 'custom',
        renderItem: this.renderGanttItem,
        dimensions: this.data.dimensions,
        encode: {
          x: [DIM_TIME_ARRIVAL_DOCK, DIM_TIME_DEPARTURE_DOCK],
          y: DIM_CATEGORY_INDEX,
          tooltip: [3, 5, 6, 4]
        },
        data: this.data.data
      }/* {
        type: 'custom',
        renderItem: this.renderAxisLabelItem,
        dimensions: this.dataIndex.dimensions,
        encode: {
          x: -1, // Then this series will not controlled by x.
          y: 0
        },
        data: echarts.util.map(this.dataIndex.data, function(item, index) {
          return [index].concat(item)
        })
      }*/
      ]
      }
      )
    }
  }
}
</script>
