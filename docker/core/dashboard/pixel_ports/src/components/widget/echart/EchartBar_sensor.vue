<template>
  <!--<div :class="className" :style="{height:height,width:width}" />-->
  <div ref="g1" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import pixelConstants from '@/utils/constants' // import
import { getSensors } from '@/api/dataextractor_IH'
import { drawTitleForCharts } from '@/utils/common'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
import { debounce } from '@/utils'
// const animationDuration = 6000
export default {
  mixins: [resize],
  props: {
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
    }
  },
  data() {
    return {
      chart: null,
      dataX: null,
      dataY: null,
      name: ''
    }
  },
  mounted() {
    //
    var execution = false
    var arrObserved = []
    var arrData = []

    if (this.filtered.id.length === 1) {
      this.name = this.filtered.id[0].name
      execution = true
    }

    if (execution) {
      this.dataX = []
      this.dataY = []

      getSensors(this.filtered.source, pixelConstants.OPERATORS_IH_MATCHES, this.name, this.filtered.start, this.filtered.end).then(response => {
        console.log('Execution getSensors Echart')
        console.log(response)
        response.forEach(item => {
          this.dataX.push(this.convertDate(item.data.observed))
          this.dataY.push(item.data.water_height)
        })

        this.$nextTick(() => {
          this.initChart(drawTitleForCharts(this.filtered.start, this.filtered.end))
        })
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      })
    } else if (this.filtered.id.length > 1) {
      // console.log('Son más de uno')
      // console.log(this.filtered.id)
      var legend = []
      // var series = []
      this.filtered.id.forEach(item => {
        legend.push(item.name)
      })
      getSensors(this.filtered.source, pixelConstants.OPERATORS_IH_ONE_OF, legend, this.filtered.start, this.filtered.end).then(response => {
        console.log('datos mas de un sensor')
        console.log(response)
        var length = legend.length

        for (var i = 0; i < length; i++) {
          arrData[i] = []
        }

        response.forEach(obj => {
          if (obj.data.name === legend[0]) {
            arrObserved.push(this.convertDate(obj.data.observed))
          }
          legend.forEach(item => {
            // console.log(item)
            // console.log(obj.data.name)
            if (item === obj.data.name) {
              // console.log(item)
              var index = legend.indexOf(item)
              // console.log(index)
              arrData[index].push(obj.data.water_height)
            }
          })
        })
        console.log(arrData)
        console.log(arrObserved)
        this.$nextTick(() => {
          this.ChartSeveralSensors(legend, arrObserved, arrData, drawTitleForCharts(this.filtered.start, this.filtered.end))
        })
      })
    } else {
      this.$nextTick(() => {
        this.initialChart()
      })
    }
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
    ChartSeveralSensors(leyenda, dataX, arrDataSensors, titlePeriodOfTime) {
      console.log('ChartSeveralSensors')
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      var option = {
        title: {
          text: titlePeriodOfTime
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          /* right: 'center',
          bottom: 0,
          orient: 'horizontal',*/
          type: 'scroll',
          orient: 'horizontal',
          // bottom: -10,
          left: 10,
          top: 25,
          data: leyenda
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: { title: this.$t('widget.download') }
          }
        },
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        /* dataZoom: {
          show: true,
          y: 410,
          realtime: true,
          start: 0,
          end: 100
        },*/
        xAxis: {
          type: 'category',
          data: dataX
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      var index = 0
      arrDataSensors.forEach(item => {
        var itemSerie = {
          name: leyenda[index],
          type: 'bar',
          data: item
        }
        option.series.push(itemSerie)
        index = index + 1
      })

      // console.log('OPTION')
      // console.log(option)

      this.chart.setOption(option)
    },
    convertDate(timestamp) {
      const plus0 = num => `0${num.toString()}`.slice(-2)

      const d = new Date(timestamp)

      const year = d.getFullYear()
      const monthTmp = d.getMonth() + 1
      const month = plus0(monthTmp)
      const date = plus0(d.getDate())
      const hour = plus0(d.getHours())
      const minute = plus0(d.getMinutes())
      const second = plus0(d.getSeconds())
      // const rest = timestamp.toString().slice(-5)

      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
      // return `${year}-${month}-${date} ${hour}:${minute}:${second}.${rest}`
    },
    convertDate2(timestamp) {
      var todate = new Date(timestamp).getDate()
      var tomonth = new Date(timestamp).getMonth() + 1
      var toyear = new Date(timestamp).getFullYear()
      return toyear + '/' + tomonth + '/' + todate
    },
    initialChart() {
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      // this.chart = echarts.init(this.$el, 'shine')
      this.chart.setOption({
        /* title: {
          text: 'Step Line'
        },*/
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Step Start']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            // name: 'Step Start',
            type: 'bar',
            step: 'start',
            data: [120, 132, 101, 134, 90, 230, 210],
            color: 'blue'
          }
        ]
      })
    },
    calculateAverage() {
      var sumatorio = 0
      this.dataY.forEach(item => {
        sumatorio = sumatorio + parseInt(item, 10)
      })

      var res = Number(sumatorio / this.dataX.length)
      return res
    },
    initChart(titlePeriodOfTime) {
      console.log('Un unico sensor')
      console.log(this.dataX)
      console.log(this.dataY)
      var average = this.calculateAverage()
      console.log('Average: ' + average)
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      this.chart.setOption({
        title: {
          text: titlePeriodOfTime
        },
        tooltip: {
          trigger: 'axis'
        },
        /* legend: {
          right: 'center',
          bottom: 0,
          orient: 'horizontal',
          data: [this.name]
        },*/
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          left: 10,
          top: 25,
          data: [this.name]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: { title: this.$t('widget.download') }
          }
        },
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        xAxis: {
          type: 'category',
          data: this.dataX
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: this.name,
            type: 'bar',
            // areaStyle: {}, // rellena el grafico de manera que es un diagrama de area.
            step: 'start',
            data: this.dataY,
            markLine: {
              data: [
                [
                  // start point of the line
                  {
                    xAxis: this.dataX[0],
                    yAxis: average,
                    symbol: 'none',
                    lineStyle: {
                      normal: {
                        color: 'black'
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: 'end',
                        formatter: 'Avg'
                      }
                    }
                  },
                  // end point of the line
                  {
                    xAxis: this.dataX[
                      this.dataX.length - 1
                    ],
                    yAxis: average,
                    symbol: 'none'
                  }
                ]
              ]
            }
          }
        ]
      })
    }
  }
}
</script>
