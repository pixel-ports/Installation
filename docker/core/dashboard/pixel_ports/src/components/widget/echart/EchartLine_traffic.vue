<template>
  <!--<div :class="className" :style="{height:height,width:width}" />-->
  <div ref="g1" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import pixelConstants from '@/utils/constants' // import
// import { getSensors } from '@/api/dataextractor_IH'
// import { drawTitleForCharts } from '@/utils/common'
import { getTrafficExecutionById } from '@/api/PAS_IH'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
// import { debounce } from '@/utils'
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
    console.log('mounted en EchartLine_traffic.vue ************')
    var execution = false

    // if (this.filtered.trafficType.lenght > 1) {
    if (this.filtered.trafficId) {
      execution = true
    } else { this.initialChart() }
    if (execution) {
      // codigo a ejecutar
      this.dataX = []
      this.dataY = []
      getTrafficExecutionById(this.filtered.trafficId)
        .then(response => {
          // console.log('*****************')
          console.log(response)
          this.drawTrafficLineChart(response.predictions)
          // switch (this.filtered.trafficType) {
          //   case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].value:
          //     this.drawMaxFlow(response.predictions)
          //     break
          //   case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].value:
          //     this.drawUnexpectedFlow(response.predictions)
          //     break
          // }
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
    drawTrafficLineChart(predictions) {
      var title = ''
      var hasColorGradient = false
      switch (this.filtered.trafficType) {
        case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].value:
          // case max_flow
          title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].label
          predictions.forEach(prediction => {
            this.dataX.push(this.convertDate(prediction.date))
            this.dataY.push(Math.round(30 - prediction.trucksExpectedFromDirectOperations))
          })
          break
        case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].value:
          // case unexpected_flow
          title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].label
          predictions.forEach(prediction => {
            this.dataX.push(this.convertDate(prediction.date))
            this.dataY.push(Math.round(prediction.trucksExpectedFromOtherOperations))
          })
          break
        case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[2].value:
          // case effective_flow
          title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[2].label
          predictions.forEach(prediction => {
            this.dataX.push(this.convertDate(prediction.date))
            this.dataY.push(Math.round(30 - prediction.trucksExpected))
          })
          break
        case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[3].value:
          // case total_expected
          title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[3].label
          predictions.forEach(prediction => {
            this.dataX.push(this.convertDate(prediction.date))
            this.dataY.push(Math.round(prediction.trucksExpected))
          })
          break
        case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[4].value:
          // case parking_expected_occupancy
          hasColorGradient = true
          predictions.forEach(prediction => {
            this.dataX.push(this.convertDate(prediction.date))
            this.dataY.push(Math.round(prediction.aspmParkingLotOccupancy))
            title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[4].label
          })
          break
        // case pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[5].value:
        //   // case  expected_congestion
        //   title = pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[5].label
        //   predictions.forEach(prediction => {
        //     this.dataX.push(this.convertDate(prediction.date))
        //     this.dataY.push(Math.round(prediction.aspmParkingLotOccupancy))
        //   })
        //   break
      }
      this.$nextTick(() => {
        this.initChart(title, hasColorGradient)
      })
    },
    occupancyValueAndColor(prediction) {
      const critical = prediction.aspmParkingLotCritical
      const warning = prediction.aspmParkingLotWarning
      const occupancyValue = Math.ceil(prediction.aspmParkingLotOccupancy)
      if (critical) {
        return { type: 'danger', value: occupancyValue }
      } else if (warning) {
        return { type: 'warning', value: occupancyValue }
      } else {
        return { type: 'success', value: occupancyValue }
      }
    },
    // drawMaxFlow(predictions) {
    //   predictions.forEach(prediction => {
    //     this.dataX.push(prediction.date)
    //     this.dataY.push(30 - prediction.trucksExpectedFromDirectOperations)
    //   })
    //   this.$nextTick(() => {
    //     this.initChart()
    //   })
    // },
    // drawUnexpectedFlow(predictions) {
    //   predictions.forEach(prediction => {
    //     this.dataX.push(prediction.date)
    //     this.dataY.push(prediction.trucksExpectedFromOtherOperations)
    //   })
    //   this.$nextTick(() => {
    //     this.initChart()
    //   })
    // },
    // ChartSeveralSensors(leyenda, dataX, arrDataSensors, titlePeriodOfTime) {
    //   this.chart = echarts.init(this.$refs['g1'], 'shine')
    //   var option = {
    //     title: {
    //       text: titlePeriodOfTime
    //     },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     /* legend: {
    //       right: 'center',
    //       bottom: 0,
    //       orient: 'horizontal',
    //       data: leyenda
    //     },*/
    //     legend: {
    //       type: 'scroll',
    //       orient: 'horizontal',
    //       left: 10,
    //       top: 25,
    //       data: leyenda
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '6%',
    //       containLabel: true
    //     },
    //     toolbox: {
    //       feature: {
    //         saveAsImage: { title: this.$t('widget.download') }
    //       }
    //     },
    //     dataZoom: [
    //       {
    //         show: true,
    //         start: 94,
    //         end: 100
    //       },
    //       {
    //         type: 'inside',
    //         start: 94,
    //         end: 100
    //       },
    //       {
    //         show: true,
    //         yAxisIndex: 0,
    //         filterMode: 'empty',
    //         width: 30,
    //         height: '80%',
    //         showDataShadow: false,
    //         left: '93%'
    //       }
    //     ],
    //     xAxis: {
    //       type: 'category',
    //       data: dataX
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: []
    //   }
    //   var index = 0
    //   arrDataSensors.forEach(item => {
    //     var itemSerie = {
    //       name: leyenda[index],
    //       type: 'line',
    //       data: item
    //     }
    //     option.series.push(itemSerie)
    //     index = index + 1
    //   })

    //   // console.log('OPTION')
    //   // console.log(option)

    //   this.chart.setOption(option)
    // },
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
            type: 'line',
            step: 'start',
            data: [120, 180, 101, 260, 90, 280, 50]
          }
        ]
      })
    },
    // calculateAverage() {
    //   var sumatorio = 0
    //   this.dataY.forEach(item => {
    //     sumatorio = sumatorio + parseInt(item, 10)
    //   })

    //   var res = Number(sumatorio / this.dataX.length)
    //   return res
    // },
    initChart(title, hasColorGradient) {
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      var option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          left: 10,
          top: 25,
          data: [title]
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
        // dataZoom: [
        //   {
        //     show: true,
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     type: 'inside',
        //     start: 94,
        //     end: 100
        //   },
        //   {
        //     show: true,
        //     yAxisIndex: 0,
        //     filterMode: 'empty',
        //     width: 30,
        //     height: '80%',
        //     showDataShadow: false,
        //     left: '93%'
        //   }
        // ],
        xAxis: {
          type: 'category',
          data: this.dataX
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: title,
            type: 'line',
            // areaStyle: {}, // rellena el grafico de manera que es un diagrama de area.
            step: 'middle',
            data: this.dataY
            // ////para dibujar un threshold...:
            // color: 'green',
            // markLine: {
            //   data: [
            //     // 1st line we want to draw
            //     [
            //       // start point of the line
            //       // we have to defined line attributes only here (not in the end point)
            //       {
            //         xAxis: this.dataX[0],
            //         yAxis: 10,
            //         symbol: 'none',
            //         lineStyle: {
            //           normal: {
            //             color: 'red'
            //           }
            //         },
            //         label: {
            //           normal: {
            //             show: true,
            //             position: 'end',
            //             formatter: 'Threshold'
            //           }
            //         }
            //       },
            //       // end point of the line
            //       {
            //         xAxis: this.dataX[this.dataX.length - 1],
            //         yAxis: 10,
            //         symbol: 'none'
            //       }
            //     ]
            //   ]
            // }
          }
        ]
      }
      if (hasColorGradient) {
        // adding color gradient to the chart with "visualMap"
        option.visualMap = [{
          show: false,
          type: 'piecewise',
          pieces: [
            { max: 40, color: 'green' },
            { min: 40, max: 80, color: 'orange' },
            { min: 80, color: 'red' }]
        }]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
