<template>
  <div class="container">
    <!--<div style="width: 930px; margin: 0 auto;">-->
    <GridView />
    <!--</div>-->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import GridView from '@/components/GridEditor/GridView'
export default {
  name: 'Home',
  components: { GridView },
  created() {
    this.$store.commit('setisEditable', true)
    this.fetchResources()
  },
  methods: {
    ...mapActions({
      fetchResources: 'fetchResources'
    })
  }
}
</script>
