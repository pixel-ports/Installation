<template>
  <div class="app-container" :style="bgc">
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane :label="$t('kpi.environmental')">
        <KPIList category="environmental" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kpi.operational')">
        <KPIList category="operational" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import KPIList from './component/kpiList.vue'

export default {
  components: {
    KPIList
  },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      list: null
    }
  }
}
</script>

<style>

</style>
