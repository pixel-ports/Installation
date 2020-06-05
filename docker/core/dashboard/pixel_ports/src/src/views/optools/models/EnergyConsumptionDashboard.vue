<template>
  <div>
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane>
        <span slot="label">
          {{ $t('specialViews.ByShip') }}
        </span>
        <EnergyConsumptionDashboardByShip />
      </el-tab-pane>
      <el-tab-pane :label="$t('specialViews.BySupplyChain')" />
    </el-tabs>
  </div>
</template>

<script>
import EnergyConsumptionDashboardByShip from './component/EnergyConsumptionDashboardByShip.vue'

export default {
  components: {
    EnergyConsumptionDashboardByShip
  },
  data: () => ({
    tab: null
  })
}
</script>

<style>

</style>
