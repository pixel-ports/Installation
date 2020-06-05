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
import { getETD } from '@/api/dataextractor_IH'
import { dateFormatterToString, timeSinceMinutes } from '@/utils/common'
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
          field: 'arrival_dock'
        }
      }
    },
    definition: {
      type: Object,
      default: function() {
        return {}
      }
    },
    data: {
      type: Array,
      default: function() {
        return [{ 'storageType': 'metadata', 'records': [{ 'data': { 'IMO': 9336713, 'source': 'FR_BAS/vcall', 'journeyid': 20208814, 'unloading_tonnage': 4000, 'arrival_dock': 1579032000000, 'pixel_etd': 1579148928547, 'unloading_cargo_fiscal_type': '', 'unloading_cargo_type': 'I.HUILE SOJA', 'unloading_agent': 'SEAINVEST', 'unloading_berth': 436, 'name': 'ORATANK', 'unloading_dangerous': false, 'location': { 'lon': 44.863, 'lat': -0.5472 }, 'dataProvider': 'http://FR_BAS/vcall', 'scheduled_arrival_dock': 1579094100000, 'operation': 'unloading' }, 'links': {}, 'timestamp': 1579276688497 }, { 'data': { 'IMO': 9192375, 'source': 'FR_BAS/vcall', 'journeyid': 20208808, 'unloading_tonnage': 7136, 'arrival_dock': 1578610800000, 'pixel_etd': 1578750259551, 'unloading_cargo_fiscal_type': '', 'unloading_cargo_type': 'I.TALL-OIL', 'unloading_agent': 'SEAINVEST', 'unloading_berth': 436, 'name': 'LAGUNA D', 'unloading_dangerous': false, 'location': { 'lon': 44.863, 'lat': -0.5472 }, 'dataProvider': 'http://FR_BAS/vcall', 'operation': 'unloading' }, 'links': {}, 'timestamp': 1579276688498 }, { 'data': { 'IMO': 9367530, 'source': 'FR_BAS/vcall', 'journeyid': 20198775, 'unloading_tonnage': 6000, 'arrival_dock': 1579032000000, 'pixel_etd': 1579168204812, 'unloading_cargo_fiscal_type': '', 'unloading_cargo_type': 'I.METHANOL', 'unloading_agent': 'SEAINVEST', 'unloading_berth': 436, 'name': 'CHEMWAY LARA', 'unloading_dangerous': false, 'location': { 'lon': 44.863, 'lat': -0.5472 }, 'dataProvider': 'http://FR_BAS/vcall', 'scheduled_arrival_dock': 1579082400000, 'operation': 'unloading' }, 'links': {}, 'timestamp': 1579276688498 }, { 'data': { 'IMO': 9053816, 'source': 'FR_BAS/vcall', 'journeyid': 20208811, 'unloading_tonnage': 2094, 'arrival_dock': 1579064400000, 'pixel_etd': 1579167914469, 'unloading_cargo_fiscal_type': '', 'unloading_cargo_type': 'I.BUTADIENE', 'unloading_agent': 'SEAINVEST', 'unloading_berth': 436, 'name': 'CORAL OBELIA', 'unloading_dangerous': false, 'location': { 'lon': 44.863, 'lat': -0.5472 }, 'dataProvider': 'http://FR_BAS/vcall', 'scheduled_arrival_dock': 1579143600000, 'operation': 'unloading' }, 'links': {}, 'timestamp': 1579276688499 }, { 'data': { 'IMO': 9031428, 'source': 'FR_BAS/vcall', 'journeyid': 20198762, 'unloading_tonnage': 1500, 'arrival_dock': 1579305660000, 'pixel_etd': 1579446127579, 'unloading_cargo_fiscal_type': '', 'unloading_cargo_type': 'I.BOIS SCIES DU NORD', 'unloading_agent': 'SEAINVEST', 'unloading_berth': 417, 'name': 'LANDY', 'unloading_dangerous': false, 'location': { 'lon': 44.863, 'lat': -0.5472 }, 'dataProvider': 'http://FR_BAS/vcall', 'scheduled_arrival_dock': 1579341600000, 'operation': 'unloading' }, 'links': {}, 'timestamp': 1579338011159 }] }]
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
    this.initCol()
    this.dataTable = this.data

    getETD(this.filtered.field, this.filtered.start, this.filtered.end).then(response => {
      this.dataTable = response[0].records
    })
  },
  beforeDestroy() {},
  methods: {
    initCol() {
      this.columns = [
        {
          prop: 'data.name',
          label: 'Name'
        },
        {
          prop: 'data.arrival_dock',
          label: 'Arrival',
          formatter: (row, col, cell, index) => dateFormatterToString(cell)
        },
        {
          prop: 'data.departure_dock',
          label: 'Departure',
          formatter: (row, col, cell, index) => dateFormatterToString(cell)
        }, {
          prop: 'data.pixel_etd',
          label: 'ETD',
          formatter: (row, col, cell, index) => dateFormatterToString(cell)
        },
        {
          label: 'Diff',
          formatter: (row, col, cell, index) => timeSinceMinutes(row.data && row.data.pixel_etd ? row.data.pixel_etd : 0, row.data && row.data.departure_dock ? row.data.departure_dock : 0)
        }
      ]
    }
  }
}
</script>
