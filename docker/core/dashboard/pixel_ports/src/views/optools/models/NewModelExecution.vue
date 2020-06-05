<template>
  <div class="app-container">
    <el-row align="center">
      <el-col :lg="24">
        <div ref="chartdiv" class="chartdiv" />
      </el-col>
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-error" @click="$router.go(-1)">
          {{ $t('newExecution.cancel') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus" @click="saveExecution">
          {{ $t('newExecution.saveExecution') }}
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>

import { getModel } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
// import pixelCommon from '@/utils/common'
// import pixelConstants from '@/utils/constants' // import class for constants

export default {
  name: 'NewModelExecution',
  directives: { waves },
  data() {
    return {
      model: null,
      result: null,
      listQuery: {
        id: undefined
      },
      chart: null
    }
  },
  computed: {},
  mounted() {
    // Get model (serviceUrl) and draw chart
    this.getModel(this.$route.params.modelId)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getModel(idModel) {
      this.listQuery.id = idModel
      getModel(this.listQuery).then(response => {
        this.model = response
        // console.log(this.model)
        // this.drawChart()
        this.drawJoseChart()
      })
      // getModel
    },
    saveExecution() {
      // empty by now
      console.log('saveExecution')
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

      this.axios.post(this.model.urls.serviceUrl).then((response) => {
        this.result = response.data
        series.data = [this.result]

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
      })
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
