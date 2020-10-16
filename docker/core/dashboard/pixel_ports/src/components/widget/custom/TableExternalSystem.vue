<template>
  <el-table
    :data="dataTable"
    :height="height"
    :style="{height:height,width:width}"
  >
    <el-table-column
      v-for="column in columns"
      :key="column.label"
      :prop="column.prop"
      :label="column.label"
      :formatter="column.formatter"
      :min-width="column.minWidth"
    />
  </el-table>
</template>

<script>
import { getVesselCallRawData } from '@/api/dataextractor_IH'
import { dateFormatterToString } from '@/utils/common'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    filtered: {
      type: Object,
      default: function() {
        return {
          field: null,
          sourceId: null
        }
      }
    },
    definition: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [],
      dataTable: []
    }
  },
  mounted() {
    console.log('mounted method')
    console.log(this.filtered)

    var execution = false

    if (this.filtered.field !== '' && this.filtered.field !== null) {
      execution = true
      this.initCol(this.filtered.sourceId, this.filtered.field)
    }

    if (execution) {
      getVesselCallRawData(this.filtered.sourceId, this.filtered.field).then(response => {
        console.log('Execution getSensors')
        console.log(response)
        this.dataTable = response
      // this.dataTable = response[0].records
      })
    } else {
      this.initCol('initial style', '')
      this.dataTable = [
        {
          'name': 'LANDY',
          'IMO': 9031428,
          'operation': 'unloading'
        }
      ]
    }
  },
  beforeDestroy() {},
  methods: {
    initCol(sourceId, field) {
      switch (sourceId) {
        case 'FR_BAS:vcall':
          switch (field) {
            case 'arrival_dock':
              this.columns = [
                {
                  prop: 'data.name',
                  label: this.$t('widget.name')
                },
                {
                  prop: 'data.IMO',
                  label: this.$t('widget.IMO')
                },
                {
                  prop: 'data.operation',
                  label: this.$t('widget.operation')
                },
                {
                  prop: 'data.arrival_dock',
                  label: this.$t('widget.arrival_dock'),
                  formatter: (row, col, cell, index) => dateFormatterToString(cell)
                }/*,
                {
                  prop: 'timestamp',
                  label: this.$t('widget.date'),
                  formatter: (row, col, cell, index) => dateFormatterToString(cell)
                }*/
              ]
              break
            case 'departure_dock':
              this.columns = [
                {
                  prop: 'data.name',
                  label: this.$t('widget.name')
                },
                {
                  prop: 'data.IMO',
                  label: this.$t('widget.IMO')
                },
                {
                  prop: 'data.operation',
                  label: this.$t('widget.operation')
                },
                {
                  prop: 'data.departure_dock',
                  label: this.$t('widget.departure_dock'),
                  formatter: (row, col, cell, index) => dateFormatterToString(cell)
                }/*,
                {
                  prop: 'timestamp',
                  label: this.$t('widget.date'),
                  formatter: (row, col, cell, index) => dateFormatterToString(cell)
                }*/
              ]
              break
          }
          break
        default:
          this.columns = [
            {
              prop: 'name',
              label: this.$t('widget.name')
            },
            {
              prop: 'IMO',
              label: this.$t('widget.IMO')
            },
            {
              prop: 'operation',
              label: this.$t('widget.operation')
            }
          ]
          break
      }
    }
  }
}
</script>
