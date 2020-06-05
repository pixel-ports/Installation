<template>
  <div class="container">
    <!--<div style="width: 930px; margin: 0 auto;">-->
    <Toolbar />
    <!--</div>-->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Toolbar from '@/components/GridEditor/DashboardToolbar'
export default {
  name: 'Home',
  components: { Toolbar },
  created() {
    this.fetchResources()
  },
  methods: {
    ...mapActions({
      fetchResources: 'fetchResources'
    })
  }
}
</script>
