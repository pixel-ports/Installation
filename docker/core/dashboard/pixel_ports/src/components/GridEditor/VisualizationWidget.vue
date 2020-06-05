<template>
  <div>
    <el-card class="grid-content" shadow="always">
      <div slot="header">
        <span>{{ item.title }}</span>
      </div>
      <component :is="item.type" :definition="item.definition" :filtered="item.filter" style="height: 500px;" />
    </el-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import EchartRadar from '@/components/widget/echart/EchartRadar'
import EchartPie from '@/components/widget/echart/EchartPie'
import EchartBar from '@/components/widget/echart/EchartBar'
import GanttBarEtd from '@/components/widget/echart/GanttBarEtd'
import GanttBarPas from '@/components/widget/echart/GanttBarPas'
import TableEtd from '@/components/widget/custom/TableEtd'
import CustomIframe from '@/components/widget/custom/CustomIframe'
import GanttElastic from '@/components/widget/custom/GanttElastic'
import resize from '@/components/widget/mixins/resize'
export default {
  name: 'VisualizationWidget',
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
  mixins: [resize],
  /*eslint-disable */
  props: ['preview', 'contenteditable', 'item', 'itemIndex'],
  /*eslint -enable */
  data() {
    return {
      editImage: false
    }
  },
  computed: {},
  created() {
    // this.saveVisualization()
  },
  methods: {
    ...mapActions([
      'saveItem'
    ]),
    saveVisualization() {
      console.log('saveVisualization')
      this.saveItem({ item: this.item, index: this.itemIndex })
    },
    save(e) {
      console.log('aqui paso por el save de VisualizationWidget')
      this.item.title = e.target.innerText
      this.saveItem({ item: this.item, index: this.itemIndex })
    }
  }
}
</script>

<style scoped>
  .grid-content {
    margin: 20px;
    min-height: 36px;
  }
</style>
