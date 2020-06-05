<template>
  <div>
    <el-tabs type="border-card" dark slider-color="green" centered color="green">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date" />
          {{ $t('event.rules') }}
        </span>
        <EventList category="rules" />
      </el-tab-pane>
      <el-tab-pane :label="$t('event.historic')">
        <EventList category="historic" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EventList from './component/eventList.vue'

export default {
  components: {
    EventList
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
