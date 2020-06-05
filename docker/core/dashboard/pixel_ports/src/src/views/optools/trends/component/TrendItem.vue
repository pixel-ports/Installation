<template>
  <div class="app-container">

    <el-row align="center">
      <el-col :span="8" align-self="start">
        <h3>{{ $t('models.requirements') }}</h3>
        <el-container>
          <el-select v-model="KPISelected" clearable :placeholder="$t('trends.selectKPIs')" :no-match-text="$t('trends.noKPIAvailable')" :multiple="selectMultiple" @change="drawChart">
            <el-option
              v-for="item in KPIList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-container>
      </el-col>
      <!--<el-col :span="8" align-self="start">
        <h3>{{ $t('trends.options') }}</h3>
        <el-container>
          <el-radio v-model="radio" label="single" @change="changeOptions">{{ $t('trends.singleGraph') }}</el-radio>
          <el-radio v-model="radio" label="multiple" @change="changeOptions">{{ $t('trends.multipleGraph') }}</el-radio>
        </el-container>
      </el-col>-->
    </el-row>
    <el-row align="center">
      <el-col :lg="24">
        <div class="chart-wrapper">
          <div :ref="'chart-' + category" :class="'chart-' + category" :style="{height:heightChart,width:widthChart}" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getKPIs, getKPILastValuesByID } from '@/api/otools'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'TrendItem',
  components: {},
  directives: { waves },
  props: {
    category: {
      type: String,
      default: 'environmental'
    },
    widthChart: {
      type: String,
      default: '100%'
    },
    heightChart: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return {
      radio: 'single',
      KPIList: [],
      KPISelected: '',
      selectMultiple: false,
      chart: null,
      listQuery: {
        id: undefined,
        categorySelected: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listQuery.categorySelected = this.category
      getKPIs(this.listQuery).then(response => {
        this.KPIList = response
        console.log('Lista KPIs')
        console.log(this.KPIList)
      })
    },
    recoverIdKPI(kpiSelected) {
      var res = ''
      for (var counter = 0; counter <= this.KPIList.length - 1; counter++) {
        if (this.KPIList[counter].name === kpiSelected) {
          res = this.KPIList[counter].id
        }
      }
      return res
    },
    drawChart() {
      if (this.chart != null) this.chart.dispose()
      if (this.selectMultiple) {
        this.drawMultipleCharts()
      } else {
        this.drawOneChart()
      }
    },
    changeOptions(value) {
      // console.log(value)
      if (this.chart) this.chart.dispose()
      if (this.radio === 'single') {
        if (this.KPISelected.length > 0) this.KPISelected = this.KPISelected[0]
        else this.KPISelected = null
        this.selectMultiple = false
        this.drawOneChart()
      } else {
        const kpiSelected = this.KPISelected
        if (kpiSelected === null) this.KPISelected = []
        else this.KPISelected = [kpiSelected]
        this.selectMultiple = true
        this.drawMultipleCharts()
      }
    },
    drawOneChart() {
      if (this.KPISelected === null) return 0

      const self = this

      this.chart = this.$am4core.create('chart-' + this.category, this.$am4charts.XYChart)
      this.chart.paddingRight = 20
      var id = this.recoverIdKPI(this.KPISelected)
      this.listQuery.id = id
      getKPILastValuesByID(this.listQuery).then(response => {
        self.chart.data = response
      })

      /* if (this.KPISelected === 'PEI-Global' || this.KPISelected === 'Congestion index at Gate 10A') {
        this.chart.data = [
          { 'year': '1950', 'value': -0.307 },
          { 'year': '1951', 'value': -0.168 },
          { 'year': '1952', 'value': -0.073 },
          { 'year': '1953', 'value': -0.027 },
          { 'year': '1954', 'value': -0.251 },
          { 'year': '1955', 'value': -0.281 },
          { 'year': '1956', 'value': -0.348 },
          { 'year': '1957', 'value': -0.074 },
          { 'year': '1958', 'value': -0.011 },
          { 'year': '1959', 'value': -0.074 },
          { 'year': '1960', 'value': -0.124 },
          { 'year': '1961', 'value': -0.024 },
          { 'year': '1962', 'value': -0.022 },
          { 'year': '1963', 'value': 0 },
          { 'year': '1964', 'value': -0.296 },
          { 'year': '1965', 'value': -0.217 },
          { 'year': '1966', 'value': -0.147 },
          { 'year': '1967', 'value': -0.15 },
          { 'year': '1968', 'value': -0.16 },
          { 'year': '1969', 'value': -0.011 },
          { 'year': '1970', 'value': -0.068 },
          { 'year': '1971', 'value': -0.19 },
          { 'year': '1972', 'value': -0.056 },
          { 'year': '1973', 'value': 0.077 },
          { 'year': '1974', 'value': -0.213 },
          { 'year': '1975', 'value': -0.17 },
          { 'year': '1976', 'value': -0.254 },
          { 'year': '1977', 'value': 0.019 },
          { 'year': '1978', 'value': -0.063 },
          { 'year': '1979', 'value': 0.05 },
          { 'year': '1980', 'value': 0.077 },
          { 'year': '1981', 'value': 0.12 },
          { 'year': '1982', 'value': 0.011 },
          { 'year': '1983', 'value': 0.177 },
          { 'year': '1984', 'value': -0.021 },
          { 'year': '1985', 'value': -0.037 },
          { 'year': '1986', 'value': 0.03 },
          { 'year': '1987', 'value': 0.179 },
          { 'year': '1988', 'value': 0.18 },
          { 'year': '1989', 'value': 0.104 },
          { 'year': '1990', 'value': 0.255 },
          { 'year': '1991', 'value': 0.21 },
          { 'year': '1992', 'value': 0.065 },
          { 'year': '1993', 'value': 0.11 },
          { 'year': '1994', 'value': 0.172 },
          { 'year': '1995', 'value': 0.269 },
          { 'year': '1996', 'value': 0.141 },
          { 'year': '1997', 'value': 0.353 },
          { 'year': '1998', 'value': 0.548 },
          { 'year': '1999', 'value': 0.298 },
          { 'year': '2000', 'value': 0.267 },
          { 'year': '2001', 'value': 0.411 },
          { 'year': '2002', 'value': 0.462 },
          { 'year': '2003', 'value': 0.47 },
          { 'year': '2004', 'value': 0.445 },
          { 'year': '2005', 'value': 0.47 }]
      } else {
        this.chart.data = [
          { 'year': '2002', 'value': 0.25 },
          { 'year': '2003', 'value': 0.37 },
          { 'year': '2004', 'value': 0.265 },
          { 'year': '2005', 'value': 0.156 },
          { 'year': '2006', 'value': 0.25 },
          { 'year': '2007', 'value': 0.325 },
          { 'year': '2008', 'value': 0.290 },
          { 'year': '2009', 'value': 0.175 },
          { 'year': '2010', 'value': 0.150 },
          { 'year': '2011', 'value': 0.120 },
          { 'year': '2012', 'value': 0.100 },
          { 'year': '2013', 'value': 0.250 }]
      } */
      // Create axes
      const dateAxis = this.chart.xAxes.push(new this.$am4charts.DateAxis())
      dateAxis.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm:ss'
      dateAxis.dataFields.category = 'lastUpdate'
      dateAxis.renderer.minGridDistance = 50
      dateAxis.renderer.grid.template.location = 0.5
      dateAxis.renderer.labels.template.horizontalCenter = 'left'
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5
      dateAxis.tooltipDateFormat = 'yyyy-MM-dd HH:mm:ss'
      // dateAxis.baseInterval = { count: 1, timeUnit: "hour" };

      // Create value axis
      const valueAxis = this.chart.yAxes.push(new this.$am4charts.ValueAxis())
      // valueAxis.baseValue = 0;

      // Create series
      const series = this.chart.series.push(new this.$am4charts.LineSeries())
      series.dataFields.valueY = 'value'
      series.dataFields.dateX = 'lastUpdate'
      series.strokeWidth = 3
      // series.tensionX = 0.77;
      series.fillOpacity = 0.1

      // bullet is added because we add tooltip to a bullet for it to change color
      const bullet = series.bullets.push(new this.$am4charts.Bullet())
      bullet.tooltipText = this.kpisSelected.name + ': {valueY}'
      bullet.adapter.add('fill', function(fill, target) {
        if (target.dataItem.valueY > self.kpisSelected.upperThres || target.dataItem.valueY < self.kpisSelected.lowerThres) {
          return self.$am4core.color('#FF0000')
        }
        return fill
      })

      const range = valueAxis.createSeriesRange(series)
      range.value = this.kpisSelected.lowerThres
      range.endValue = range.value - 1000
      range.contents.stroke = this.$am4core.color('#FF0000')
      range.contents.fill = range.contents.stroke
      range.contents.strokeOpacity = 0.7
      range.contents.fillOpacity = 0.1

      const range2 = valueAxis.createSeriesRange(series)
      range2.value = this.kpisSelected.upperThres
      range2.endValue = range2.value + 1000
      range2.contents.stroke = this.$am4core.color('#FF0000')
      range2.contents.fill = range2.contents.stroke
      range2.contents.strokeOpacity = 0.7
      range2.contents.fillOpacity = 0.1

      // if(this.kpisSelected=="PEI-Global"){
      //     let range3 = dateAxis.axisRanges.create();
      //     range3.date = new Date(1988,6,1);
      //     range3.endDate = new Date();
      //     range3.grid.disabled = true;
      //     range3.axisFill.fillOpacity = 0.1;
      // }

      // Add scrollbar
      const scrollbarX = new this.$am4charts.XYChartScrollbar()
      scrollbarX.series.push(series)
      this.chart.scrollbarX = scrollbarX

      this.chart.cursor = new this.$am4charts.XYCursor()
    },
    drawMultipleCharts() {
      const self = this
      this.chart = this.$am4core.create('chart-' + this.category, this.$am4charts.XYChart)
      this.chart.paddingRight = 20
      // Add data
      this.chart.data = [
        { 'year': '1950', 'value1': -0.307, 'value2': -0.507, 'value3': -0.507 },
        { 'year': '1951', 'value1': -0.168, 'value2': -0.357, 'value3': -0.207 },
        { 'year': '1952', 'value1': -0.073, 'value2': -0.300, 'value3': -0.123 },
        { 'year': '1953', 'value1': -0.027, 'value2': -0.195, 'value3': -0.150 },
        { 'year': '1954', 'value1': -0.251, 'value2': -0.251, 'value3': -0.100 },
        { 'year': '1955', 'value1': -0.281, 'value2': -0.100, 'value3': -0.100 },
        { 'year': '1956', 'value1': -0.348, 'value2': -0.307, 'value3': 0 },
        { 'year': '1957', 'value1': -0.074, 'value2': -0.307, 'value3': 0.2 },
        { 'year': '1958', 'value1': -0.011, 'value2': -0.350, 'value3': 0.2 },
        { 'year': '1959', 'value1': -0.074, 'value2': -0.210, 'value3': 0.3 },
        { 'year': '1960', 'value1': -0.124, 'value2': -0.175, 'value3': 0.15 },
        { 'year': '1961', 'value1': -0.024, 'value2': 0, 'value3': 0 },
        { 'year': '1962', 'value1': -0.022, 'value2': 0.1, 'value3': -0.1 },
        { 'year': '1963', 'value1': 0, 'value2': 0.150, 'value3': 0.085 },
        { 'year': '1964', 'value1': -0.296, 'value2': 0.125, 'value3': 0.1 },
        { 'year': '1965', 'value1': -0.217, 'value2': 0.175, 'value3': 0.350 }]

      // Create axes
      const dateAxis = this.chart.xAxes.push(new this.$am4charts.DateAxis())
      dateAxis.dateFormatter.inputDateFormat = 'yyyy'
      dateAxis.dataFields.category = 'year'
      dateAxis.renderer.minGridDistance = 50
      dateAxis.renderer.grid.template.locati0on = 0.5
      dateAxis.renderer.labels.template.horizontalCen0ter = 'left'
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5

      // Create value axis
      this.chart.yAxes.push(new this.$am4charts.ValueAxis())

      this.KPISelected.forEach((kpi, index) => {
        const series = self.chart.series.push(new self.$am4charts.LineSeries())
        series.dataFields.valueY = 'value' + (index + 1)
        series.dataFields.dateX = 'year'
        series.strokeWidth = 3
        series.tensionX = 0.77
        const bullet = series.bullets.push(new this.$am4charts.Bullet())
        bullet.tooltipText = kpi + ': {valueY}'

        // Add scrollbar
        if (index === 0) {
          const scrollbarX = new this.$am4charts.XYChartScrollbar()
          scrollbarX.series.push(series)
          this.chart.scrollbarX = scrollbarX
        }
      })

      this.chart.cursor = new this.$am4charts.XYCursor()
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart {
    width: 100%;
    height: 645px;
  }
</style>
