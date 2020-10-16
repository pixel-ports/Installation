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
          id: [],
          wrongValue: ''
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
    console.log('ECHART PIE')
    var execution = false
    var operador = ''
    var name = ''
    var wrongValue = ''
    var totalRegister = 0
    var wrongRegisters = 0

    if (this.filtered.id.length === 1) {
      name = this.filtered.id[0].name
      execution = true
      // this.initCol(this.filtered.source)
      this.oneRegister = true
      operador = pixelConstants.OPERATORS_IH_MATCHES
    } else if (this.filtered.id.length > 1) {
      name = []
      this.filtered.id.forEach(item => {
        name.push(item.name)
      })
      execution = true
      // this.initCol('FR_BOD:TideSensor TWO COLUMNS')
      this.oneRegister = false
      operador = pixelConstants.OPERATORS_IH_ONE_OF
    }

    if (execution) {
      wrongValue = this.filtered.wrongValue
      getSensors(this.filtered.source, operador, name, this.filtered.start, this.filtered.end).then(response => {
        console.log(response)
        totalRegister = response.length
        response.forEach(item => {
          if (item.data.water_height === wrongValue) {
            wrongRegisters = wrongRegisters + 1
          }
        })

        var measuresWithError = wrongRegisters
        var measuresWithoutError = totalRegister - wrongRegisters
        this.$nextTick(() => {
          this.drawChart(measuresWithError, measuresWithoutError, wrongValue, drawTitleForCharts(this.filtered.start, this.filtered.end))
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
    drawChart(measuresWithError, measuresWithoutError, wrongValue, titlePeriodOfTime) {
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      this.chart.setOption({
        title: {
          text: titlePeriodOfTime
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
            'Measures with code: ' + wrongValue
          ]
        },
        toolbox: {
          feature: {
            saveAsImage: { title: this.$t('widget.download') }
          }
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
                name: 'Measures with code: ' + wrongValue
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: 'DEMO',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 80],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '1' },
              { value: 240, name: '2' },
              { value: 149, name: '3' },
              { value: 100, name: '4' },
              { value: 59, name: '5' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
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
    }
  }
}
</script>
