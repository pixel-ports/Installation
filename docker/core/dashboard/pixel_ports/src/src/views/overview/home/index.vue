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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { widgetDashboardFetchList } from '@/api/widget'
import EchartRadar from '@/components/widget/echart/EchartRadar'
import EchartPie from '@/components/widget/echart/EchartPie'
import EchartBar from '@/components/widget/echart/EchartBar'
import GanttBarEtd from '@/components/widget/echart/GanttBarEtd'
import GanttBarPas from '@/components/widget/echart/GanttBarPas'
import TableEtd from '@/components/widget/custom/TableEtd'
import CustomIframe from '@/components/widget/custom/CustomIframe'
import GanttElastic from '@/components/widget/custom/GanttElastic'

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
    TableEtd
  },
  props: {},
  data() {
    return {
      widgets: []
    }
  },
  created() {},
  mounted() {
    widgetDashboardFetchList(this.listQuery).then(response => {
      this.widgets = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .grid-content {
    margin: 20px;
    min-height: 36px;
  }
</style>
