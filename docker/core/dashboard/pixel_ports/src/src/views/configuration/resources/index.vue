<template>
  <div>
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane>
        <span slot="label">
          <!--<i class="el-icon-date" />-->
          {{ $t('area.areas') }}
        </span>
        <ResourceList category="area" />
      </el-tab-pane>
      <el-tab-pane :label="$t('area.machines')">
        <ResourceList category="machine" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ResourceList from './component/resourceList.vue'

export default {
  components: {
    ResourceList
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
