<template>
  <el-table
    :data="tableData"
    border
    fit
    style="width: 100%;"
    empty-text="No data available"
    :row-class-name="getRowClass"
  >
    <el-table-column label="Initial time" align="center" :sortable="true">
      <template slot-scope="{row}">
        <span>{{ row.dateObservedFrom }}</span>
      </template>
    </el-table-column>
    <el-table-column label="End time" align="center" :sortable="true">
      <template slot-scope="{row}">
        <span>{{ row.dateObservedTo }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Number of vehicles" align="center" :sortable="true">
      <template slot-scope="{row}">
        <span>{{ (row.intensity) ? row.intensity : '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Avg. Speed of vehicles" align="center" class-name="small-padding fixed-width">
      <template slot-scope="{row}">
        <span>{{ (row.averageVehicleSpeed) ? row.averageVehicleSpeed : '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Congestion level" align="center" :sortable="true">
      <template slot-scope="scope">
        <el-tag
          :type="getCongestionLevel(scope.row[validField]).color"
          disable-transitions
        >{{ getCongestionLevel(scope.row[validField]).name }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import trafficData from '@/../static/trafficUPV-data.js'

export default {
  name: 'TableTraffic',
  props: {
    // lowerThreshold: {
    //   type: Number,
    //   required: true
    // },
    // upperThreshold: {
    //   type: Number,
    //   required: true
    // },
    gate: {
      type: String,
      required: false,
      default: '10A'
    }
  },
  data() {
    return {
      tableData: trafficData
    }
  },
  computed: {
    validField() {
      if (trafficData[0].intensity) return 'intensity'
      else return 'averageVehicleSpeed'
    }
  },
  methods: {
    getCongestionLevel(value) {
      if (value > this.upperThreshold) return { name: 'High congestion', color: 'danger' }
      else if (value < this.lowerThreshold) return { name: 'Low congestion', color: 'success' }
      else return { name: 'Medium congestion', color: 'warning' }
    },
    getRowClass({ row, rowIndex }) {
      if (rowIndex > 14) return 'predicted-row'
      else return ''
    }
  }
}
</script>

<style>

</style>
