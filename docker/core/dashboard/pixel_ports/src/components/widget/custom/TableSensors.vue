<template>
  <div v-if="oneRegister">
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
  </div>
  <div v-else>
    <div v-for="(item,indexInput) in sensorsCollection" :key="indexInput">
      <el-collapse v-model="activeInput" accordion @change="handleChangeInputSection">
        <el-collapse-item :title="item.ID" :name="item.ID">
          <el-table
            :data="item.sensors"
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
            <!--<el-table-column :label="$t('widget.water_height')">
              <template slot-scope="scope">{{ scope.row.water_height }}</template>
            </el-table-column>
            <el-table-column :label="$t('widget.date')">
              <template slot-scope="scope">{{ scope.row.observed }}</template>
            </el-table-column>-->
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>

</template>

<script>
import { getSensors } from '@/api/dataextractor_IH'
import pixelConstants from '@/utils/constants' // import
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
      oneRegister: true,
      sensorsCollection: [],
      activeInput: ['0']
    }
  },
  mounted() {
    // console.log('mounted method TableSensor')
    // console.log(this.filtered)

    // this.dataTable = this.data
    /* console.log(this.filtered.field)
    console.log(this.filtered.start)
    console.log(this.filtered.end)*/
    var name = ''
    var execution = false
    var operador = ''
    var arrData = []

    if (this.filtered.id.length === 1) {
      name = this.filtered.id[0].name
      execution = true
      this.initCol(this.filtered.source)
      this.oneRegister = true
      operador = pixelConstants.OPERATORS_IH_MATCHES
    } else if (this.filtered.id.length > 1) {
      name = []
      this.filtered.id.forEach(item => {
        name.push(item.name)
      })
      execution = true
      this.initCol('FR_BOD:TideSensor TWO COLUMNS')
      this.oneRegister = false
      operador = pixelConstants.OPERATORS_IH_ONE_OF
    }

    if (execution) {
      console.log(this.filtered.start)
      console.log(this.filtered.end)
      console.log(this.filtered.source)
      console.log(name)
      console.log('Previo petición getSensors')
      getSensors(this.filtered.source, operador, name, this.filtered.start, this.filtered.end).then(response => {
        console.log('Execution getSensors Table')
        console.log(response)
        if (this.oneRegister) {
          this.dataTable = response
        } else {
          // Ajustamos la respuesta para mostrarla por grupos
          var length = name.length

          for (var i = 0; i < length; i++) {
            arrData[i] = []
          }

          response.forEach(obj => {
            name.forEach(item => {
              if (item === obj.data.name) {
              // console.log(item)
                var index = name.indexOf(item)
                var information = {
                  'water_height': obj.data.water_height,
                  'observed': this.convertDate(obj.data.observed)
                }
                // console.log(index)
                arrData[index].push(information)
              }
            })
          })
          console.log('Peticion con dos sensores')
          console.log(arrData)
          var index = 0
          this.sensorsCollection = []
          name.forEach(device => {
            var sensor = {
              'ID': device,
              'sensors': arrData[index]
            }
            this.sensorsCollection.push(sensor)
            index = index + 1
          })
        }
      })
    } else {
      this.initCol('initial style')
      this.dataTable = [
        {
          'name': 'Sensor 1',
          'water_height': 330
        }
      ]
    }
  },
  beforeDestroy() {},
  methods: {
    handleChangeInputSection(val) {
      console.log('Cambio el estado del control que expande/colapsa')
      console.log(val)
    },
    convertDate(timestamp) {
      const plus0 = num => `0${num.toString()}`.slice(-2)

      const d = new Date(timestamp)

      const year = d.getFullYear()
      const monthTmp = d.getMonth() + 1
      const month = plus0(monthTmp)
      const date = plus0(d.getDate())
      const hour = plus0(d.getHours())
      const minute = plus0(d.getMinutes())
      const second = plus0(d.getSeconds())
      // const rest = timestamp.toString().slice(-5)

      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
      // return `${year}-${month}-${date} ${hour}:${minute}:${second}.${rest}`
    },
    initCol(source) {
      switch (source) {
        case 'FR_BOD:TideSensor':
          this.columns = [
            {
              prop: 'data.name',
              label: this.$t('widget.name')
            },
            {
              prop: 'data.water_height',
              label: this.$t('widget.water_height')
            },
            {
              prop: 'data.observed',
              label: this.$t('widget.date'),
              formatter: (row, col, cell, index) => dateFormatterToString(cell)
            }
          ]
          break
        case 'FR_BOD:TideSensor TWO COLUMNS':
          this.columns = [
            {
              prop: 'water_height',
              label: this.$t('widget.water_height')
            },
            {
              prop: 'observed',
              label: this.$t('widget.date'),
              formatter: (row, col, cell, index) => dateFormatterToString(cell)
            }
          ]
          break
        default:
          this.columns = [
            {
              prop: 'name',
              label: this.$t('widget.name')
            },
            {
              prop: 'water_height',
              label: this.$t('widget.water_height')
            }
          ]
          break
      }
    }
  }
}
</script>
