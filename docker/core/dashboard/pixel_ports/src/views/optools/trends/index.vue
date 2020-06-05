<template>
  <div>
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ $t('kpi.environmental') }}
        </span>
        <TrendItem category="environmental" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kpi.operational')">
        <TrendItem category="operational" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TrendItem from './component/TrendItem.vue'

export default {
  components: {
    TrendItem
  },
  data() {
    return {
      list: null
    }
  }
}
</script>

<style>

</style>
