<template>
  <div class="app-container">
    <h2 class="mx-5 text-center">Total consumption: {{ totalConsumption }} kWh</h2>
    <div ref="lineChart" class="lineChart" />
    <div ref="chartdiv" class="gantt" />

    <!-- Menu Buttons -->
    <div class="filter-container">
      <router-link :to="{name:'models'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-back" @click="executionDialog = true">
          {{ $t('executionsList.back') }}
        </el-button>
      </router-link>
    </div>
    <!-- Vessel Info Dialog -->
    <div class="text-center">
      <el-dialog :visible.sync="executionDialog">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>{{ $t('specialViews.vesselOperations') }} ({{ vessel }})</span>
          </div>
          <div style="padding: 14px;">
            <div ref="vesselOperationsGantt" class="vessel-operations-gantt" />
            <div class="bottom clearfix">
              <el-button type="text" @click="executionDialog=false;vesselOperationsGantt.dispose()">{{ $t('common.ok') }}</el-button>
            </div>
          </div>
        </el-card>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import energy from './energy'

export default {
  name: 'EnergyDashboardByShip',
  components: {},
  directives: {},
  data() {
    return {
      chart: null,
      executionDialog: false,
      vesselOperationsGantt: null,
      lineChart: null,
      totalConsumption: 0,
      vessel: null,
      vesselOperations: {},
      vessels: [energy[0], energy[1], energy[2], energy[3], energy[4]]
    }
  },
  mounted() {
    console.log(this.vessels)
    this.drawGanttChart()
    this.drawLineChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null

    this.lineChart.dispose()
    this.lineChart = null
  },
  methods: {
    drawGanttChart() {
      const self = this
      const data = []

      const colorSet = new this.$am4core.ColorSet()// comento un new
      colorSet.saturation = 0.4

      this.vessels.forEach((element, index) => {
        const vesselName = element.STOPOVER.BOAT.Name
        const vesselOperations = element.HANDLINGS[0].supplychain.OPERATIONS_SEQUENCE

        self.vesselOperations[vesselName] = []

        Object.values(vesselOperations).forEach(op => {
          const operation = {}
          operation.vesselName = vesselName
          operation.operationName = op.Label
          operation.start = new Date(op.startTS * 1000)
          operation.end = new Date(op.endTS * 1000)
          operation.consumption = op.consumption
          operation.color = colorSet.getIndex(index + 1).brighten(0)
          data.push(operation)
          self.vesselOperations[vesselName].push(operation)
        })
      })
      // console.log(data);

      this.chart = this.$am4core.create(this.$refs.chartdiv, this.$am4charts.XYChart)
      this.chart.data = data
      this.chart.paddingRight = 20
      this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'

      const categoryAxis = this.chart.yAxes.push(new this.$am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'vesselName'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.inversed = true

      const dateAxis = this.chart.xAxes.push(new this.$am4charts.DateAxis())
      dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm'
      dateAxis.renderer.minGridDistance = 70
      dateAxis.baseInterval = { count: 1, timeUnit: 'minute' }
      // dateAxis.min = new Date(2019,7,23,21,0,0,0).getTime();
      // dateAxis.max = new Date(2019,7,23,24,0,0,0).getTime();
      // dateAxis.max = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 24, 0, 0, 0).getTime(); //today at 24:00
      // dateAxis.strictMinMax = true;
      dateAxis.renderer.tooltipLocation = 0
      dateAxis.resizable = true

      const series = this.chart.series.push(new this.$am4charts.ColumnSeries())
      series.columns.template.width = this.$am4core.percent(80)
      series.dataFields.openDateX = 'start'
      series.dataFields.dateX = 'end'
      series.dataFields.categoryY = 'vesselName'
      series.columns.template.propertyFields.fill = 'color'
      series.columns.template.propertyFields.stroke = 'color'
      series.columns.template.strokeOpacity = 1
      series.resizable = true

      // Scrollbars
      this.chart.scrollbarX = new this.$am4core.Scrollbar()
      this.chart.scrollbarY = new this.$am4core.Scrollbar()

      // Click
      series.columns.template.events.on('hit', function(event) {
        const data = event.target.dataItem.dataContext
        self.executionDialog = true
        self.vessel = data.vesselName
        self.drawOperationsGantt(self.vessel)
        // console.log(data)
      })
    },
    drawOperationsGantt(vessel) {
      this.vesselOperationsGantt = this.$am4core.create(this.$refs.vesselOperationsGantt, this.$am4charts.XYChart)
      this.vesselOperationsGantt.data = this.vesselOperations[vessel]
      this.vesselOperationsGantt.paddingRight = 20
      this.vesselOperationsGantt.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'

      const categoryAxis = this.vesselOperationsGantt.yAxes.push(new this.$am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'operationName'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.inversed = true

      const dateAxis = this.vesselOperationsGantt.xAxes.push(new this.$am4charts.DateAxis())
      dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm'
      dateAxis.renderer.minGridDistance = 70
      dateAxis.baseInterval = { count: 1, timeUnit: 'minute' }
      dateAxis.renderer.tooltipLocation = 0
      dateAxis.resizable = true

      const series = this.vesselOperationsGantt.series.push(new this.$am4charts.ColumnSeries())
      series.columns.template.width = this.$am4core.percent(80)
      series.columns.template.tooltipText = '[bold]{operationName}[/] \n\n  Start: {openDateX} \n End: {dateX} \n Consumption: {consumption.electricity} {consumption.electricityUnit}'
      series.dataFields.openDateX = 'start'
      series.dataFields.dateX = 'end'
      series.dataFields.categoryY = 'operationName'
      series.columns.template.propertyFields.fill = 'color'
      series.columns.template.propertyFields.stroke = 'color'
      series.columns.template.strokeOpacity = 1

      series.resizable = true

      // Add label
      var labelBullet = series.bullets.push(new this.$am4charts.LabelBullet())
      labelBullet.label.text = '[bold]{consumption.electricity} {consumption.electricityUnit}'
      labelBullet.locationY = 0.5

      // Scrollbars
      this.vesselOperationsGantt.scrollbarX = new this.$am4core.Scrollbar()
      this.vesselOperationsGantt.scrollbarY = new this.$am4core.Scrollbar()
    },
    drawLineChart() {
      const self = this
      // Create this.chart instance
      this.lineChart = this.$am4core.create(this.$refs.lineChart, this.$am4charts.XYChart)
      this.lineChart.paddingRight = 20
      // let data = []
      // let vesselOperations = this.vessels[0].HANDLINGS[0].supplychain.OPERATIONS_SEQUENCE;
      // let ops = Object.values(vesselOperations);

      // for(let i=0; i<ops.length;i++){
      //     let operation = {};
      //     operation.date = new Date(ops[i].startTS*1000);
      //     operation.value = ops[i].consumption.electricity;
      //     data.push(operation);
      // }
      // console.log(data)

      this.lineChart.data = [
        { date: '2019-11-29 21:20', value: 2880 },
        { date: '2019-11-29 21:30', value: 2880 },
        { date: '2019-11-29 21:40', value: 6480 },
        { date: '2019-11-29 21:50', value: 6480 },
        { date: '2019-11-29 22:00', value: 2880 },
        { date: '2019-11-29 22:10', value: 2880 },
        { date: '2019-11-29 22:20', value: 4320 },
        { date: '2019-11-29 22:30', value: 4320 },
        { date: '2019-11-29 22:40', value: 4320 },
        { date: '2019-11-29 22:50', value: 4320 },
        { date: '2019-11-29 23:00', value: 4320 },
        { date: '2019-11-29 23:10', value: 4320 },
        { date: '2019-11-29 23:20', value: 4320 }
      ]

      this.lineChart.data.forEach(element => {
        self.totalConsumption += element.value
      })
      // Create axes
      const dateAxis = this.lineChart.xAxes.push(new this.$am4charts.DateAxis())
      dateAxis.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'
      dateAxis.dataFields.category = 'date'
      dateAxis.renderer.minGridDistance = 50
      dateAxis.renderer.grid.template.location = 0.5
      dateAxis.renderer.labels.template.horizontalCenter = 'left'
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5

      // Create value axis
      const valueAxis = this.lineChart.yAxes.push(new this.$am4charts.ValueAxis())
      // valueAxis.baseValue = 0;

      // Create series
      const series = this.lineChart.series.push(new this.$am4charts.LineSeries())
      series.dataFields.valueY = 'value'
      series.dataFields.dateX = 'date'
      series.strokeWidth = 3
      series.tensionX = 0.77
      series.fillOpacity = 0.1

      // bullet is added because we add tooltip to a bullet for it to change color
      const bullet = series.bullets.push(new this.$am4charts.Bullet())
      bullet.tooltipText = 'Consumption: {valueY} kWh'
      bullet.adapter.add('fill', function(fill, target) {
        if (target.dataItem.valueY > 5000) {
          return self.$am4core.color('#FF0000')
        }
        return fill
      })

      const range = valueAxis.createSeriesRange(series)
      range.value = 5000
      range.endValue = 100000
      range.contents.stroke = this.$am4core.color('#FF0000')
      range.contents.fill = range.contents.stroke
      range.contents.strokeOpacity = 0.7
      range.contents.fillOpacity = 0.1

      const range2 = valueAxis.createSeriesRange(series)
      range2.value = 0
      range2.endValue = -5000
      range2.contents.stroke = this.$am4core.color('#FF0000')
      range2.contents.fill = range2.contents.stroke
      range2.contents.strokeOpacity = 0.7
      range2.contents.fillOpacity = 0.1

      this.lineChart.cursor = new this.$am4charts.XYCursor()
    }
  }
}
</script>

<style scoped>
  .gantt {
    width: 100%;
    height: 420px;
  }
  .lineChart {
    width: 100%;
    height: 400px;
  }
  .vessel-operations-gantt {
    width: 100%;
    height: 600px;
  }
</style>
