<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-row style="margin-bottom:10px;">
        <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfExecutions">
          {{ $t('resources.back') }}
        </el-link>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col v-for="widget in widgets" :key="widget._id" :span="12">
        <el-card class="grid-content" shadow="always">
          <div slot="header" class="clearfix">
            <span>{{ widget.title }}</span>
            <el-tooltip class="item" effect="dark" :content="widget.description" placement="bottom-end">
              <el-button style="float: right; padding: 3px 0" type="text">Info</el-button>
            </el-tooltip>
          </div>
          <component :is="widget.type" :definition="widget.definition" :filtered="widget.filter" style="height: 550px;" />
        </el-card>
      </el-col>
    </el-row>
    <div class="filter-container" style="margin-top:10px;">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfExecutions">{{ $t('resources.back') }}</el-link>
    </div>
  </div>
</template>

<script>
// import { witFetchList } from '@/api/widget'
import EchartRadar from '@/components/widget/echart/EchartRadar'
import EchartPie from '@/components/widget/echart/EchartPie'
import EchartBar from '@/components/widget/echart/EchartBar'
import GanttBarEtd from '@/components/widget/echart/GanttBarEtd'
import GanttBarPas from '@/components/widget/echart/GanttBarPas'
import CustomIframe from '@/components/widget/custom/CustomIframe'

export default {
  name: 'OpToolsView',
  components: {
    EchartRadar,
    EchartBar,
    EchartPie,
    CustomIframe,
    GanttBarEtd,
    GanttBarPas
  },
  props: {},
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      widgets: [],
      data: null
    }
  },
  created() {},

  mounted() {
    this.data = this.$route.params

    if (this.data.type === 'model') {
      this.widgets.push({
        '_id': '5e1f449cebe85f038c5b67b5',
        'title': 'All data of execution',
        'description': 'All data',
        'source': 'model-pas',
        'type': 'gantt-bar-pas',
        'filter': {
          'id': [{
            'modelId': this.data.modelId,
            'executionId': this.data.executionId
          }]
        },
        'home': {
          'published': true,
          'position': [
            0,
            0,
            0,
            0
          ]
        }
      })
    } else {
      var date = new Date()
      this.widgets.push({
        '_id': '5e1f449cebe85f038c5b67b0',
        'title': 'Last week',
        'description': 'Data from the last 1 week',
        'source': 'algorithm-pa',
        'type': 'gantt-bar-etd',
        'filter': {
          'field': 'arrival_dock',
          'start': date.getTime() - 604800000,
          'end': date.getTime()
        },
        'home': {
          'published': true,
          'position': [
            0,
            0,
            0,
            0
          ]
        }
      })

      this.widgets.push({
        '_id': '5e1f449cebe85f038c5b67b1',
        'title': 'Last months',
        'description': 'Data from the last 6 months',
        'source': 'algorithm-pa',
        'type': 'gantt-bar-etd',
        'filter': {
          'field': 'arrival_dock',
          'start': date.getTime() - 15552000000,
          'end': date.getTime()
        },
        'home': {
          'published': true,
          'position': [
            0,
            0,
            0,
            0
          ]
        }
      })
    }
  },
  methods: {
    gotoListOfExecutions() {
      this.$router.push({ name: 'Model Execution List', params: { id: this.data.modelId }})
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
