<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
// import trafficData from '@/views/traffic/traffic-data.js'
import trafficData from '@/../static/trafficUPV-data.js'
import resize from '../mixins/resize'

export default {
  name: 'EchartLineTrafficUpv',
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
          formTrafficUPV: {
            numOfGates: null,
            lowerThreshold: 200,
            upperThreshold: 100,
            trafficParam: null
          }
        }
      }
    }
  },
  data() {
    return {
      data: null,
      refresh: null,
      chartData: trafficData
    }
  },
  computed: {
    unit() {
      if (this.filtered.formTrafficUPV.trafficParam === 'intensity') return this.$t('widget.vehicles')
      else if (this.filtered.formTrafficUPV.trafficParam === 'speed') return this.$t('widget.kmh')
      else return null
    }
  },
  mounted() {
    console.log(this.filtered.formTrafficUPV.numOfGates)
    console.log(this.filtered.formTrafficUPV.lowerThreshold)
    console.log(this.filtered.formTrafficUPV.upperThreshold)
    console.log(this.filtered.formTrafficUPV.trafficParam)
    this.$nextTick(() => {
      this.drawChart()
    })
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
    drawChart() {
      // initialize echarts instance with prepared DOM
      // var myChart = echarts.init(document.getElementById('chart'))
      var myChart = echarts.init(this.$el, 'macarons')

      // draw chart
      myChart.setOption({
        // title: {
        //   text: 'Historic and prediction of traffic',
        //   subtext: ''
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // toolbox: {
        //   show: false,
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        dataset: {
          source: this.chartData
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          name: this.unit,
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          axisPointer: {
            snap: true
          }
        },
        visualMap: {
          type: 'piecewise',
          show: false,
          dimension: 0,
          splitNumber: 2,
          categories: [
            'Real data', 'Predicted data'
          ],
          min: 0,
          max: 100,
          calculable: true,
          realtime: false
        //   pieces: [{
        //     min: 0,
        //     max: 150,
        //     color: 'green'
        //   }, {
        //     maxOpen: 150,
        //     color: 'blue'
        //   }]
        },
        grid: {
          show: false,
          width: '85%',
          top: 40,
          bottom: 40
          // left: 40,
          // right: 30
        },
        series: [
          {
            name: 'TrafficFlowObservedPIXEL-THPA-gate10A',
            type: 'line',
            smooth: true,
            markLine: {
              data: [{
                name: this.filtered.formTrafficUPV.trafficParam === null ? '' : 'High congestion',
                yAxis: this.filtered.formTrafficUPV.upperThreshold
              },
              {
                name: this.filtered.formTrafficUPV.trafficParam === null ? '' : 'Low congestion',
                yAxis: this.filtered.formTrafficUPV.lowerThreshold
              }
              ],
              symbol: 'none',
              lineStyle: {
                color: '#000',
                type: 'dashed',
                width: 2
              },
              label: {
                show: true,
                position: 'middle',
                formatter: '{b}'
              }
            },
            encode: {
              // Map dimension "amount" to the X axis.
              x: 'dateObservedTo',
              // Map dimension "product" to the Y axis.
              y: 'intensity'
            },
            markArea: {
              // itemStyle: {
              //   color: '#EDE5C5'
              // },
              data: [
                [{
                  name: 'Predicted data',
                  xAxis: '2019-12-07T14:00:00Z'
                }, {
                  name: 'real data',
                  xAxis: '2019-12-08T00:00:00Z'
                }]
              ]
            }
          }
        ]
      })
    }
  }
}
</script>

<style>
/* #chart {
  width: 100%;
  height: 350px;
} */
</style>
