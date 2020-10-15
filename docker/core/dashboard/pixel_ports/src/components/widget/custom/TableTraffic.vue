<template>
  <div>
    <!-- <h2>Traffic Predictions</h2> -->
    <el-table
      :data="dataTable"
      :height="height"
      :style="{height:height,width:width}"
      :default-sort="{prop: 'date', order: 'ascending'}"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.label"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
        :min-width="column.minWidth"
        :width="column.width"
        :sortable="column.prop == 'date'"
      />
      <el-table-column
        v-if="filtered.trafficId"
        prop="occupacyAndCongestion"
        :label="$t('widget.parking_expected_occupancy')"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.occupacyAndCongestion.type" effect="dark">
            {{ scope.row.occupacyAndCongestion.value }}
          </el-tag>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import pixelConstants from '@/utils/constants' // import
import { dateFormatterToString } from '@/utils/common'
import { getTrafficExecutionById } from '@/api/PAS_IH'
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
          start: null,
          end: null,
          source: '',
          id: []
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
      dataTable: [],
      sensorsCollection: [],
      activeInput: ['0']
    }
  },
  computed: {
    initColumns() {
      return [
        {
          prop: 'date',
          label: this.$t('widget.date'),
          width: '85',
          // formatter: (row, col, cell, index) => 'aA' + 'bB' + '\n' + 'cC'
          formatter: (row, col, cell, index) => dateFormatterToString(cell)
        },
        {
          prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].value,
          label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].label,
          formatter: (row, col, cell, index) => (Math.round(cell * 100)) / 100
        },
        {
          prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].value,
          label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].label,
          formatter: (row, col, cell, index) => (Math.round(cell * 100)) / 100
        },
        {
          prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[2].value,
          label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[2].label,
          formatter: (row, col, cell, index) => (Math.round(cell * 100)) / 100
        },
        {
          prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[3].value,
          label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[3].label,
          formatter: (row, col, cell, index) => (Math.round(cell * 100)) / 100
        }
        // ,
        // {
        //   prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[4].value,
        //   label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[4].label,
        //   formatter: (row, col, cell, index) => (Math.round(cell * 100)) / 100
        // }
        // ,
        // {
        //   prop: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[5].value,
        //   label: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[5].label
        // }
      ]
    },
    initColumnDummyData() {
      return [
        {
          prop: 'date',
          label: this.$t('widget.date')
        },
        {
          prop: 'max_flow',
          label: 'Max Flow'
        }
      ]
    }
  },
  mounted() {
    // console.log('mounted method TableTraffic')
    if (this.filtered.trafficId) {
      getTrafficExecutionById(this.filtered.trafficId)
        .then(response => {
          var dataTableItem = {}
          // console.log(response)
          response.predictions.forEach(prediction => {
            dataTableItem = {
              'date': prediction.date,
              [pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[0].value]: 30 - prediction.trucksExpectedFromDirectOperations,
              [pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[1].value]: prediction.trucksExpectedFromOtherOperations,
              [pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[2].value]: 30 - prediction.trucksExpected,
              [pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[3].value]: prediction.trucksExpected,
              // [pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION[4].value]: prediction.aspmParkingLotOccupancy,
              'occupacyAndCongestion': this.occupancyValueAndColor(prediction)
            }
            this.dataTable.push(dataTableItem)
          })
        })
      this.columns = this.initColumns
    } else {
      this.columns = this.initColumnDummyData
      this.dataTable = [
        {
          'date': 'd/m/y',
          'max_flow': 30
        },
        {
          'date': 'd/m/y',
          'max_flow': 25
        }
      ]
    }
  },
  beforeDestroy() {},
  methods: {
    occupancyValueAndColor(prediction) {
      const critical = prediction.aspmParkingLotCritical
      const warning = prediction.aspmParkingLotWarning
      const occupancyValue = Math.ceil(prediction.aspmParkingLotOccupancy)
      if (critical) {
        return { type: 'danger', value: occupancyValue }
      } else if (warning) {
        return { type: 'warning', value: occupancyValue }
      } else {
        return { type: 'success', value: occupancyValue }
      }
    }
  }
}
</script>
