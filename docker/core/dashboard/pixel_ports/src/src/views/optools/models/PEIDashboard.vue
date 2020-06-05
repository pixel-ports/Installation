<template>
  <div class="app-container">
    <el-container>
      <el-row>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ $t('specialViews.PEIValue') }}</span>
            </div>
            <div ref="gauge" class="gauge" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ $t('specialViews.TechnicalReliability') }}</span>
            </div>
            <div ref="solidgauge" class="solidgauge" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ $t('specialViews.PEIsubindices') }}</span>
            </div>
            <el-container>
              <el-row>
                <el-col>
                  <div ref="barLeft" class="barLeft" />
                </el-col>
                <el-col>
                  <div ref="barRight" class="barRight" />
                  <div>
                    <h3>Last update: </h3>
                    <p>{{ convertDate(new Date()) }}</p>
                  </div>
                </el-col>
              </el-row>
            </el-container>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
    <div class="filter-container">
      <router-link :to="{name:'models'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-back">
          {{ $t('executionsList.back') }}
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getModel } from '@/api/otools'
import pixelConstants from '@/utils/constants' // import class for constants
import axios from 'axios'
export default {
  name: 'PEIDashboard',
  components: {},
  directives: {},
  data() {
    return {
      pei: null,
      dashboardUrl: null,
      gaugeChart: {
        chart: null,
        axis: null,
        gradient: null,
        label: null,
        hand: null
      },
      solidGaugeChart: {
        chart: null,
        categoryAxis: null,
        categories: ['Ships', 'Terminals', 'Port Authorities'],
        valueAxis: null,
        seriesOuter: null,
        seriesInner: null
      },
      barsContainer: null,
      subContainerLeft: null,
      subContainerRight: null,
      configDialog: false,
      listQuery: {
        id: undefined
      }
    }
  },
  beforeDestroy() {
    this.gaugeChart.chart.dispose()
    this.gaugeChart = null
    this.solidGaugeChart.chart.dispose()
    this.solidGaugeChart = null
  },
  mounted() {
    this.getModel()
  },
  methods: {
    convertDate(inputFormat) {
      function pad(s) {
        return s < 10 ? '0' + s : s
      }
      var d = new Date(inputFormat)
      return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
    },
    drawGaugeChart() {
      this.gaugeChart.chart = this.$am4core.create('gauge', this.$am4charts.GaugeChart)
      this.gaugeChart.chart.innerRadius = -15

      this.gaugeChart.axis = this.gaugeChart.chart.xAxes.push(new this.$am4charts.ValueAxis())
      this.gaugeChart.axis.min = 0
      this.gaugeChart.axis.max = 100
      this.gaugeChart.axis.strictMinMax = true

      this.gaugeChart.gradient = new this.$am4core.LinearGradient()
      this.gaugeChart.gradient.stops.push({ color: this.$am4core.color('red') })
      this.gaugeChart.gradient.stops.push({ color: this.$am4core.color('yellow') })
      this.gaugeChart.gradient.stops.push({ color: this.$am4core.color('green') })

      this.gaugeChart.axis.renderer.line.stroke = this.gaugeChart.gradient
      this.gaugeChart.axis.renderer.line.strokeWidth = 15
      this.gaugeChart.axis.renderer.line.strokeOpacity = 1
      this.gaugeChart.axis.renderer.grid.template.disabled = true

      this.gaugeChart.label = this.gaugeChart.chart.radarContainer.createChild(this.$am4core.Label)
      this.gaugeChart.label.isMeasured = false
      this.gaugeChart.label.fontSize = 45
      this.gaugeChart.label.x = this.$am4core.percent(50)
      this.gaugeChart.label.y = this.$am4core.percent(100)
      this.gaugeChart.label.horizontalCenter = 'middle'
      this.gaugeChart.label.verticalCenter = 'bottom'
      this.gaugeChart.label.text = this.pei.value

      this.gaugeChart.hand = this.gaugeChart.chart.hands.push(new this.$am4charts.ClockHand())
      this.gaugeChart.hand.innerRadius = this.$am4core.percent(20)
      this.gaugeChart.hand.pin.disabled = true
      this.gaugeChart.hand.value = this.pei.value
    },
    drawSolidGaugeChart() {
      const self = this
      this.solidGaugeChart.chart = this.$am4core.create('solidgauge', this.$am4charts.RadarChart)

      // Add data
      this.solidGaugeChart.chart.data = [
        {
          'category': 'Ships',
          'value': 80,
          'full': 100
        },
        {
          'category': 'Terminals',
          'value': 35,
          'full': 100
        },
        {
          'category': 'Port Authorities',
          'value': 92,
          'full': 100
        }
      ]

      // Make chart not full circle
      this.solidGaugeChart.chart.startAngle = -90
      this.solidGaugeChart.chart.endAngle = 180
      this.solidGaugeChart.chart.innerRadius = this.$am4core.percent(20)

      // Set number format
      this.solidGaugeChart.chart.numberFormatter.numberFormat = "#.#'%'"

      // Create axes
      this.solidGaugeChart.categoryAxis = this.solidGaugeChart.chart.yAxes.push(new this.$am4charts.CategoryAxis())
      this.solidGaugeChart.categoryAxis.dataFields.category = 'category'
      this.solidGaugeChart.categoryAxis.renderer.grid.template.location = 0
      this.solidGaugeChart.categoryAxis.renderer.grid.template.strokeOpacity = 0
      this.solidGaugeChart.categoryAxis.renderer.labels.template.horizontalCenter = 'right'
      this.solidGaugeChart.categoryAxis.renderer.labels.template.fontWeight = 500
      this.solidGaugeChart.categoryAxis.renderer.labels.template.adapter.add('fill', function(fill, target) {
        return (target.dataItem.index >= 0) ? self.solidGaugeChart.chart.colors.getIndex(target.dataItem.index) : fill
      })
      this.solidGaugeChart.categoryAxis.renderer.minGridDistance = 10

      this.solidGaugeChart.valueAxis = this.solidGaugeChart.chart.xAxes.push(new this.$am4charts.ValueAxis())
      this.solidGaugeChart.valueAxis.renderer.grid.template.strokeOpacity = 0
      this.solidGaugeChart.valueAxis.min = 0
      this.solidGaugeChart.valueAxis.max = 100
      this.solidGaugeChart.valueAxis.strictMinMax = true

      // Create series: outer
      this.solidGaugeChart.seriesOuter = this.solidGaugeChart.chart.series.push(new this.$am4charts.RadarColumnSeries())
      this.solidGaugeChart.seriesOuter.dataFields.valueX = 'full'
      this.solidGaugeChart.seriesOuter.dataFields.categoryY = 'category'
      this.solidGaugeChart.seriesOuter.clustered = false
      this.solidGaugeChart.seriesOuter.columns.template.fill = new this.$am4core.InterfaceColorSet().getFor('alternativeBackground')
      this.solidGaugeChart.seriesOuter.columns.template.fillOpacity = 0.08
      this.solidGaugeChart.seriesOuter.columns.template.cornerRadiusTopLeft = 20
      this.solidGaugeChart.seriesOuter.columns.template.strokeWidth = 0
      this.solidGaugeChart.seriesOuter.columns.template.radarColumn.cornerRadius = 20

      // Create series: inner
      this.solidGaugeChart.seriesInner = this.solidGaugeChart.chart.series.push(new this.$am4charts.RadarColumnSeries())
      this.solidGaugeChart.seriesInner.dataFields.valueX = 'value'
      this.solidGaugeChart.seriesInner.dataFields.categoryY = 'category'
      this.solidGaugeChart.seriesInner.clustered = false
      this.solidGaugeChart.seriesInner.columns.template.strokeWidth = 0
      this.solidGaugeChart.seriesInner.columns.template.tooltipText = '{category}: [bold]{value}[/]'
      this.solidGaugeChart.seriesInner.columns.template.radarColumn.cornerRadius = 20

      this.solidGaugeChart.seriesInner.columns.template.adapter.add('fill', function(fill, target) {
        return self.solidGaugeChart.chart.colors.getIndex(target.dataItem.index)
      })

      // Add cursor
      this.solidGaugeChart.chart.cursor = new this.$am4charts.RadarCursor()
    },
    drawBarsChart() {
      const self = this

      const subContainerLeft = this.$am4core.create('barLeft', this.$am4core.Container)
      subContainerLeft.width = this.$am4core.percent(100)
      subContainerLeft.height = this.$am4core.percent(100)
      subContainerLeft.layout = 'vertical'
      subContainerLeft.align = 'right'

      const subContainerRight = this.$am4core.create('barRight', this.$am4core.Container)
      subContainerRight.width = this.$am4core.percent(100)
      subContainerRight.height = this.$am4core.percent(100)
      subContainerRight.layout = 'vertical'

      for (var i = 0; i < this.pei.children.length; i++) {
        const el = this.pei.children[i]
        if (i < this.pei.children.length / 2) createBulletChart(subContainerLeft, el.name, el.value, 90)
        else createBulletChart(subContainerRight, el.name, el.value, 90)
      }

      /* Create ranges */
      function createRange(axis, from, to, color) {
        const range = axis.axisRanges.create()
        range.value = from
        range.endValue = to
        range.axisFill.fill = color
        range.axisFill.fillOpacity = 0.8
        range.label.disabled = true
      }

      /* Create bullet chart with specified color type for background */
      function createBulletChart(parent, category, value, target) {
        // let colors = ["#19d228", "#b4dd1e", "#f4fb16", "#f6d32b", "#fb7116"];
        const colors = [self.$am4core.color('green'), '#b3e923', self.$am4core.color('yellow'), '#f7d53b', self.$am4core.color('red')]

        /* Create chart instance */
        const chart = parent.createChild(self.$am4charts.XYChart)

        /* Add data */
        if (category.length > 5) category = category.substring(0, 5) + '...'
        chart.data = [{
          'category': category,
          'value': value,
          'target': target
        }]

        /* Create axes */
        const categoryAxis = chart.yAxes.push(new self.$am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'category'
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.inversed = true
        categoryAxis.renderer.grid.template.disabled = true
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.minWidth = 80

        const valueAxis = chart.xAxes.push(new self.$am4charts.ValueAxis())
        valueAxis.renderer.minGridDistance = 30
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.min = 0
        valueAxis.max = 100
        valueAxis.strictMinMax = true

        switch (category) {
          case 'WASTE':
          case 'LIGHT':
          case 'WATER':
            valueAxis.renderer.labels.template.adapter.add('text', function(text) {
              return text + '%'
            })
            break
        }

        const gradient = new self.$am4core.LinearGradient()
        for (var j = 0; j < 5; ++j) {
          // add each color that makes up the gradient
          gradient.addColor(self.$am4core.color(colors[j]))
        }

        createRange(valueAxis, 0, 100, gradient)

        /* Create series */
        const series = chart.series.push(new self.$am4charts.ColumnSeries())
        series.dataFields.valueX = 'value'
        series.dataFields.categoryY = 'category'
        series.columns.template.fill = self.$am4core.color('#000')
        series.columns.template.stroke = self.$am4core.color('#fff')
        series.columns.template.strokeWidth = 1
        series.columns.template.strokeOpacity = 0.5
        series.columns.template.height = self.$am4core.percent(25)
        series.columns.template.tooltipText = '{category}: {value}'

        const series2 = chart.series.push(new self.$am4charts.LineSeries())
        series2.dataFields.valueX = 'target'
        series2.dataFields.categoryY = 'category'
        series2.strokeWidth = 0

        const bullet = series2.bullets.push(new self.$am4charts.Bullet())
        const line = bullet.createChild(self.$am4core.Line)
        line.x1 = 0
        line.y1 = -40
        line.x2 = 0
        line.y2 = 40
        line.stroke = self.$am4core.color('#000')
        line.strokeWidth = 4
      }
    },
    createCharts() {
      // console.log('createCharts')
      axios
        .request({
          url: this.dashboardUrl,
          method: 'get',
          headers: {
            Authorization: pixelConstants.API_KEY_SWAGGER_PIXEL_DATAMODEL,
            'Content-Type': pixelConstants.Content_Type_Application_Json
          }
        })
        .then(response => {
          console.log('Error inside')
          this.pei = response.data
          this.drawGaugeChart()
          this.drawSolidGaugeChart()
          this.drawBarsChart()
        })
        .catch(console.log)
      /* axios.get(this.dashboardUrl).then((response) => {
        this.pei = response.data
        this.drawGaugeChart()
        this.drawSolidGaugeChart()
        this.drawBarsChart()
      }).catch((error) => {
        console.log(error)
      }) */
    },
    getModel() {
      this.listQuery.id = this.$route.params.modelId
      getModel(this.listQuery).then(response => {
        this.dashboardUrl = response.urls.dashboardUrl
        // console.log(this.dashboardUrl)
        this.createCharts()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .gauge {
    width: 100%;
    height: 400px;
  }

  .solidgauge {
    width: 100%;
    height: 400px;
  }

  .barLeft {
    width: 100%;
    height: 300px;
  }

  .barRight {
    width: 100%;
    height: 200px;
  }
</style>
