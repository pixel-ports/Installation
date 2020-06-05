<template>
  <div class="app-container">
    <el-row align="center">
      <el-col :lg="24">
        <div ref="chartdiv" class="chartdiv" />
      </el-col>
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-back" @click="$router.go(-1)">
          {{ $t('executionsList.back') }}
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>

import { getInstance, getScheduledInstance } from '@/api/otools'

export default {
  name: 'ViewModelExecution',
  components: {},
  data() {
    return {
      execution: null,
      listQuery: {
        id: undefined,
        executionId: undefined
      },
      chart: null
    }
  },
  computed: {
    executionId() {
      return this.$route.params.executionId
    }
  },
  mounted() {
    this.getExecution(this.executionId)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getExecution(id) {
      console.log(id)
      var self = this
      this.listQuery.id = this.id
      if (this.$route.name.includes('Scheduled Execution')) {
        getScheduledInstance(this.listQuery).then(response => {
          self.execution = response
        })
      } else {
        getInstance(this.listQuery).then(response => {
          self.execution = response
        })
      }
      // this.drawChart()
      this.drawJoseChart()
    },
    drawJoseChart() {
      // Create chart
      this.chart = this.$am4core.create(this.$refs.chartdiv, this.$am4pluginsForceDirected.ForceDirectedTree)

      // Create series
      const series = this.chart.series.push(new this.$am4pluginsForceDirected.ForceDirectedSeries())
      series.data = [{ 'year': '2002', 'value': 0.25 },
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

      // Set up data fields
      series.dataFields.linkWith = 'linkWith'
      series.dataFields.name = 'name'
      series.dataFields.id = 'name'
      series.dataFields.value = 'value'
      series.dataFields.children = 'children'

      // Add labels
      series.nodes.template.label.text = '{name}'
      series.fontSize = 15
      series.linkWithStrength = 0
      series.minRadius = 30
      series.maxRadius = 30

      const nodeTemplate = series.nodes.template
      nodeTemplate.tooltipText = '{name}: [bold]{value}[/]'
      nodeTemplate.fillOpacity = 1
      nodeTemplate.label.hideOversized = true
      nodeTemplate.label.truncate = true

      const linkTemplate = series.links.template
      linkTemplate.strokeWidth = 1
      const linkHoverState = linkTemplate.states.create('hover')
      linkHoverState.properties.strokeOpacity = 1
      linkHoverState.properties.strokeWidth = 2
    },
    drawChart() {
      // Create chart
      this.chart = this.$am4core.create(this.$refs.chartdiv, this.$am4pluginsForceDirected.ForceDirectedTree)

      // Create series
      const series = this.chart.series.push(new this.$am4pluginsForceDirected.ForceDirectedSeries())
      series.data = [this.execution.result]

      // Set up data fields
      series.dataFields.linkWith = 'linkWith'
      series.dataFields.name = 'name'
      series.dataFields.id = 'name'
      series.dataFields.value = 'value'
      series.dataFields.children = 'children'

      // Add labels
      series.nodes.template.label.text = '{name}'
      series.fontSize = 15
      series.linkWithStrength = 0
      series.minRadius = 30
      series.maxRadius = 30

      const nodeTemplate = series.nodes.template
      nodeTemplate.tooltipText = '{name}: [bold]{value}[/]'
      nodeTemplate.fillOpacity = 1
      nodeTemplate.label.hideOversized = true
      nodeTemplate.label.truncate = true

      const linkTemplate = series.links.template
      linkTemplate.strokeWidth = 1
      const linkHoverState = linkTemplate.states.create('hover')
      linkHoverState.properties.strokeOpacity = 1
      linkHoverState.properties.strokeWidth = 2
    }
  }
}
</script>

<style lang="scss" scoped>
  .chartdiv {
    width: 100%;
    height: 550px;
  }
</style>
