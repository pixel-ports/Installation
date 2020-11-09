<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col v-for="widget in widgets" :key="widget._id" :xs="24" :sm="12" :lg="12" :span="12">
        <el-card class="grid-content" shadow="always">
          <div slot="header" class="clearfix">
            <span>{{ widget.title }}</span>
            <el-tooltip class="item" effect="dark" :content="widget.description" placement="bottom-end">
              <el-button style="float: right; padding: 3px 0" type="text"> {{ $t('home.info') }}</el-button>
            </el-tooltip>
          </div>
          <component :is="widget.type" :definition="widget.definition" :filtered="widget.filter" style="height: 500px;" />
          <div class="bottom  clearfix">
            <el-button type="text" class="button" @click="showInModal(widget)">{{ $t('widget.maximize') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-if="chartProperties != null" :title="chartProperties.title" width="85%" :visible.sync="dialogCompleteSerie" hide-overlay transition="dialog-bottom-transition">
      <component :is="chartProperties.type" :definition="chartProperties.definition" :filtered="chartProperties.filter" style="height: 600px;" />
    </el-dialog>
  </div>
</template>

<script>
import { widgetDashboardFetchList } from '@/api/widget'
import EchartRadar from '@/components/widget/echart/EchartRadar'
import EchartPie from '@/components/widget/echart/EchartPie'
import EchartBar from '@/components/widget/echart/EchartBar'
import EchartBarSensor from '@/components/widget/echart/EchartBar_sensor'
import EchartLineSensor from '@/components/widget/echart/EchartLine_sensor'
import EchartLineTraffic from '@/components/widget/echart/EchartLine_traffic'
import EchartPieSensor from '@/components/widget/echart/EchartPie_sensor'
import GanttBarEtd from '@/components/widget/echart/GanttBarEtd'
import GanttBarPas from '@/components/widget/echart/GanttBarPas'
import TableEtd from '@/components/widget/custom/TableEtd'
import TableSensors from '@/components/widget/custom/TableSensors'
import TableTraffic from '@/components/widget/custom/TableTraffic'
import TableExternalSystem from '@/components/widget/custom/TableExternalSystem'
import MapSensor from '@/components/widget/custom/Map'
import CustomIframe from '@/components/widget/custom/CustomIframe'
import GanttElastic from '@/components/widget/custom/GanttElastic'
import MapDispersion from '@/components/widget/custom/DispersionMap'
import MapNoise from '@/components/widget/custom/NoiseMap'
import TrafficMapUpv from '@/components/widget/custom/TrafficMapUpv'
import EchartLineTrafficUpv from '@/components/widget/echart/EchartLine_trafficUpv'

export default {
  name: 'Overview',
  components: {
    EchartRadar,
    EchartBar,
    EchartPie,
    CustomIframe,
    GanttBarEtd,
    GanttBarPas,
    GanttElastic,
    TableEtd,
    TableSensors,
    TableTraffic,
    TableExternalSystem,
    EchartBarSensor,
    EchartLineSensor,
    EchartLineTraffic,
    EchartPieSensor,
    MapSensor,
    MapDispersion,
    MapNoise,
    TrafficMapUpv: TrafficMapUpv,
    EchartLineTrafficUpv
  },
  props: {},
  data() {
    return {
      widgets: [],
      dialogCompleteSerie: false,
      chartProperties: null
    }
  },
  created() {},
  mounted() {
    widgetDashboardFetchList(this.listQuery).then(response => {
      console.log(response)
      this.widgets = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    showInModal(widget) {
      console.log(widget)
      this.dialogCompleteSerie = true
      this.chartProperties = widget
    }
  }
}
</script>

<style lang="scss" scoped>
  .grid-content {
    margin: 20px;
    min-height: 36px;
  }
</style>
