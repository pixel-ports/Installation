<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input v-model="searchText" :placeholder="$t('kpi.searchKPI')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="createKPI">
        {{ $t('kpi.addNewKPI') }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:30px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('kpi.emptyKPIs')"
      >
        <el-table-column :label="$t('models.name')" align="center" :sortable="true" sort-by="name">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.creation')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.creation | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('kpi.index_Ref')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.indexRef }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('kpi.idRef')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.idRef }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('kpi.thresholds')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.kpiThresholds.lowerThres + " - " + row.kpiThresholds.upperThres }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="small" class="runBtn" @click="showDetails(row)">
              <i class="el-icon-info">
                {{ $t('kpi.showDetails') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="scheduleBtn" @click="showTrends(row)">
              <i class="el-icon-pie-chart">
                {{ $t('kpi.showTrends') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="editBtn" @click="editKPI(row)">
              <i class="el-icon-edit">
                {{ $t('kpi.editKPI') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" @click="deleteKPI(row.id)">
              <i class="el-icon-delete-solid">
                {{ $t('kpi.deleteKPI') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="viewResultKPIDialog" :title="titleTrendKPI">
      <span class="detailKPI">{{ $t('kpi.minValue') }}</span>{{ minTrend }}<br>
      <span class="detailKPI">{{ $t('kpi.maxValue') }}</span>{{ maxTrend }}<br>
      <span class="detailKPI">{{ $t('kpi.averageValue') }}</span>{{ avgTrend }}<br>
      <el-row style="margin-top:10px;" align="center">
        <el-form ref="dataTrends" :model="dataTrends" label-position="left" label-width="70px">
          <el-col :span="9" align-self="start">
            <el-form-item label-width="70px" :label="$t('kpi.periodFrom')" class="drag-select" required>
              <el-date-picker
                v-model="dataTrends.dateFrom"
                style="width:95%"
                type="date"
                value-format="yyyy-MM-dd"
                @change="validateFrom()"
              />
              <div v-if="viewDateFromRequired" style="color:red;width=100%">
                {{ $t('scheduledExecutionsList.startDateRequired') }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="60px" :label="$t('kpi.periodTo')" class="drag-select" required>
              <el-date-picker
                v-model="dataTrends.dateTo"
                style="width:95%"
                type="date"
                value-format="yyyy-MM-dd"
                @change="validateTo()"
              />
              <div v-if="viewDateToRequired" style="color:red;width=100%">
                {{ $t('scheduledExecutionsList.startTimeRequired') }}
              </div>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="6">
          <el-button type="success" class="filter-item" style="float:right;" @click="filterTrend()">
            {{ $t('common.filter') }}
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <div ref="g1" style="height: 400px; width: 100%;" />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="closeTrendDialog()">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="viewInfoKPIDialog" :title="titleInfoKPI">
      <el-card class="box-card">
        <span class="detailKPI">{{ $t('kpi.calculationFrequency') }}</span>{{ detailFrequency }}<br>
        <span class="detailKPI">{{ $t('kpi.lastValue') }}</span>{{ detailValue }}<br>
        <span class="detailKPI">{{ $t('kpi.calculationPeriod') }}</span><br>
        <span class="detailKPI">{{ $t('kpi.periodFrom') }}</span>{{ detailFrom }}<br>
        <span class="detailKPI">{{ $t('kpi.periodTo') }}</span>{{ detailTo }}<br>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="viewInfoKPIDialog = false">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- add / update model el-form  fullscreen-->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.name')" prop="name">
              <el-input ref="name" v-model="dataForm.name" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('kpi.indexRef')" prop="indexRef">
              <el-input v-model="dataForm.indexRef" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.description')" prop="description">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('models.idRef')" prop="idRef">
              <el-input v-model="dataForm.idRef" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <h3>{{ $t('kpi.thresholds') }}</h3>
          <el-col :span="12">
            <el-form-item :label-width="labelThresholdColumn" :label="$t('kpi.lowerThreshold')" prop="kpiThresholds.lowerThres">
              <el-input-number v-model="dataForm.kpiThresholds.lowerThres" :min="0" style="width:95%" @change="changeLowerThreshold" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelThresholdColumn" :label="$t('kpi.upperThreshold')" prop="kpiThresholds.upperThres">
              <el-input-number v-model="dataForm.kpiThresholds.upperThres" :min="0" style="width:95%" @change="changeUpperThreshold" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="dialogStatus===$t('kpi.createKPI')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getKPIs, getKPI, removeKPI, updateKPI, addKPI, getKPILastValuesByID, getStateKPIByID, getStateKPIByID_date } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on
import pixelConstants from '@/utils/constants' // import class for constants
import PEI_Output from './files/pei_output.json'
import STATS_Output from './files/stats_output.json'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/widget/mixins/resize'

export default {
  name: 'KPIList',
  components: { Pagination },
  directives: { waves },
  mixins: [resize],
  props: {
    category: {
      type: String,
      default: 'environmental'
    }
  },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%'
      },
      dataX: null,
      dataY: null,
      dataTrends: {
        dateTo: null,
        dateFrom: null
      },
      viewDateFromRequired: false,
      viewDateToRequired: false,
      searchText: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        categorySelected: '',
        page: 1,
        limit: 5,
        id: undefined,
        from: undefined,
        to: undefined
      },
      detailValue: '',
      detailFrequency: '',
      detailFrom: '',
      detailTo: '',
      minTrend: '',
      maxTrend: '',
      avgTrend: '',
      titleTrendKPI: '',
      titleInfoKPI: '',
      viewResultKPIDialog: false,
      viewInfoKPIDialog: false,
      labelFirstColumn: '105px',
      labelSecondColumn: '95px',
      labelThresholdColumn: '140px',
      textMapForCategory: {
        environmental: this.$t('kpi.categoryEnvironmental'),
        operational: this.$t('kpi.categoryOperational')
      },
      dataForm: {
        indexRef: '',
        idRef: '',
        name: '',
        description: '',
        category: '',
        kpiThresholds: {
          lowerThres: '',
          upperThres: ''
        },
        otStatus: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        indexRef: [{ required: true, message: this.$t('kpi.errIndexRefRequired'), trigger: 'blur' }],
        idRef: [{ required: true, message: this.$t('kpi.errIDRefRequired'), trigger: 'blur' }],
        'kpiThresholds.lowerThres': [{ required: true, message: this.$t('kpi.errLowerThresRequired'), trigger: 'change' }],
        'kpiThresholds.upperThres': [{ required: true, message: this.$t('kpi.errUpperThresRequired'), trigger: 'change' }]
      }
    }
  },
  computed: {
    stats_output() {
      return STATS_Output
    },
    pei_output() {
      return PEI_Output
    },
    filteredBySearchText() {
      return this.list.filter(kpi => kpi.name.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    filteredBySearchTextLength() {
      return this.filteredBySearchText.length
    },
    filteredByPagination() {
      const page = this.listQuery.page
      const limit = this.listQuery.limit

      if (Math.ceil(this.filteredBySearchTextLength / limit) >= page) {
        return this.filteredBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.filteredBySearchText.slice(0, limit)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    validateFrom(value) {
      if (this.dataTrends.dateFrom !== null && this.dataTrends.dateFrom !== undefined) {
        this.viewDateFromRequired = false
      } else {
        this.viewDateFromRequired = true
      }
    },
    validateTo(value) {
      if (this.dataTrends.dateTo !== null && this.dataTrends.dateTo !== undefined) {
        this.viewDateToRequired = false
      } else {
        this.viewDateToRequired = true
      }
    },
    filterTrend() {
      if (this.checkDateTime()) {
        console.log(this.dataTrends.dateFrom)
        console.log(this.dataTrends.dateTo)
        // El Id lo rellena en la función que abre el modal
        this.listQuery.from = this.dataTrends.dateFrom
        this.listQuery.to = this.dataTrends.dateTo
        // Start delete
        var trends = this.stats_output
        var arrX = []
        var arrY = []
        trends.values.forEach(value => {
          arrY.push(value.kpiValue)
          var DateFrom = value.calculationPeriod.from.substring(0, 10)
          var DateTo = value.calculationPeriod.to.substring(0, 10)
          var intervalTime = DateFrom + ' - ' + DateTo
          arrX.push(intervalTime)
        })
        this.dataX = arrX
        this.dataY = arrY
        this.$nextTick(() => {
          this.initChart(name)
        })
        // end delete
        /* getStateKPIByID_date(this.listQuery).then(response => {
          console.log(response)
          var trends = response
          this.minTrend = trends.min
          this.maxTrend = trends.max
          this.avgTrend = trends.mean
          var arrX = []
          var arrY = []
          trends.values.forEach(value => {
            arrY.push(value.kpiValue)
            var DateFrom = value.calculationPeriod.from.substring(0, 10)
            var DateTo = value.calculationPeriod.to.substring(0, 10)
            var intervalTime = DateFrom + ' - ' + DateTo
            arrX.push(intervalTime)
          })
          this.dataX = arrX
          this.dataY = arrY
          this.$nextTick(() => {
            this.initChart(name)
          })
        }).catch(err => { console.error(err) }) */
      }
    },
    checkDateTime() {
      if (this.dataTrends.dateTo === '' || this.dataTrends.dateTo === null) {
        this.viewDateToRequired = true
      } else {
        this.viewDateToRequired = false
      }
      if (this.dataTrends.dateFrom === '' || this.dataTrends.dateFrom === null) {
        this.viewDateFromRequired = true
      } else {
        this.viewDateFromRequired = false
      }

      if (this.viewDateToRequired || this.viewDateFromRequired) {
        return false
      } else {
        return true
      }
    },
    resetDataTrends() {
      this.dataTrends = {
        dateTo: null,
        dateFrom: null
      }
    },
    closeTrendDialog() {
      this.resetDataTrends()
      this.viewResultKPIDialog = false
      this.viewDateFromRequired = false
      this.viewDateToRequired = false
    },
    showDetails(row) {
      console.log('Show Details')
      var details = this.pei_output
      details.forEach(detail => {
        this.detailValue = detail.kpiValue
        this.detailFrequency = detail.calculationFrequency
        this.detailFrom = detail.calculationPeriod.from.substring(0, 10)
        this.detailTo = detail.calculationPeriod.to.substring(0, 10)
      })
      this.viewInfoKPIDialog = true
      this.titleInfoKPI = this.$t('kpi.infoRelatedToKPI') + row.name
      this.listQuery.id = row.id
      /* getKPILastValuesByID(this.listQuery).then(response => {
        console.log(response)
        var details = response
        details.forEach(detail => {
          this.detailValue = detail.kpiValue
          this.detailFrequency = detail.calculationFrequency
          this.detailFrom = detail.calculationPeriod.from.substring(0, 10)
          this.detailTo = detail.calculationPeriod.to.substring(0, 10)
        })
      }).catch(err => { console.error(err) })*/
    },
    showTrends(row) {
      console.log('Show Trends')
      this.viewResultKPIDialog = true
      this.titleTrendKPI = this.$t('kpi.trendsRelatedToKPI') + row.name
      this.listQuery.id = row.id
      var name = row.name
      // start delete
      var trends = this.stats_output
      this.minTrend = trends.min
      this.maxTrend = trends.max
      this.avgTrend = trends.mean
      var arrX = []
      var arrY = []
      trends.values.forEach(value => {
        arrY.push(value.kpiValue)
        var DateFrom = value.calculationPeriod.from.substring(0, 10)
        var DateTo = value.calculationPeriod.to.substring(0, 10)
        var intervalTime = DateFrom + ' - ' + DateTo
        arrX.push(intervalTime)
      })
      this.dataX = arrX
      this.dataY = arrY
      this.$nextTick(() => {
        this.initChart(name)
      })
      // end delete

      /* getStateKPIByID(this.listQuery).then(response => {
        console.log(response)
        var trends = response
        this.minTrend = trends.min
        this.maxTrend = trends.max
        this.avgTrend = trends.mean
        var arrX = []
        var arrY = []
        trends.values.forEach(value => {
          arrY.push(value.kpiValue)
          var DateFrom = value.calculationPeriod.from.substring(0, 10)
          var DateTo = value.calculationPeriod.to.substring(0, 10)
          var intervalTime = DateFrom + ' - ' + DateTo
          arrX.push(intervalTime)
        })
        this.dataX = arrX
        this.dataY = arrY
        this.$nextTick(() => {
          this.initChart(name)
        })
      }).catch(err => { console.error(err) }) */
    },
    initChart(name) {
      this.chart = echarts.init(this.$refs['g1'], 'shine')
      this.chart.setOption({
        title: {
          text: name
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 'center',
          bottom: 0,
          orient: 'horizontal',
          data: [name]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        /* toolbox: {
          feature: {
            saveAsImage: {}
          }
        }, */
        xAxis: {
          type: 'category',
          data: this.dataX
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: name,
            type: 'line',
            // areaStyle: {}, // rellena el grafico de manera que es un diagrama de area.
            step: 'start',
            data: this.dataY,
            color: 'green'
          }
        ]
      })
    },
    changeLowerThreshold(value) {
      console.log('Lower Threshold: ' + value)
    },
    changeUpperThreshold(value) {
      console.log('Upper Threshold: ' + value)
    },
    handleFilter() {

    },
    getList() {
      this.listLoading = true
      this.listQuery.categorySelected = this.category
      console.log('category: ' + this.category)
      getKPIs(this.listQuery).then(response => {
        console.log('Result')
        console.log(response)
        this.list = response // mapping.mapToModels(response)
        console.log(this.list)
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getListFiltered() {
      this.listLoading = true
      getKPI(this.listQuery).then(response => {
        var KPIS = []
        KPIS.push(response)
        this.list = KPIS // mapping.mapToModel(response)
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    deleteKPI(idKPI) {
      this.listQuery.id = idKPI
      this.$confirm(this.$t('common.removeKPI'), this.$t('common.deleteKPI'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await removeKPI(this.listQuery)
        this.getList()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
    },
    handleClose(done) {
      this.$confirm(this.$t('common.closeDialog'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    resetdataForm() {
      this.dataForm = {
        id: undefined,
        indexRef: '',
        idRef: '',
        name: '',
        description: '',
        category: '',
        kpiThresholds: {
          lowerThres: '',
          upperThres: ''
        },
        otStatus: ''
      }
    },
    createKPI() {
      this.resetdataForm()
      this.dialogStatus = this.$t('kpi.createKPI')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editKPI(row) {
      console.log(row)
      this.dataForm = Object.assign({}, row) // copy object
      this.dialogStatus = this.$t('kpi.editKPI')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(formName) {
      // console.log('createData')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dataForm.category = this.category
          console.log(this.dataForm)
          addKPI(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          console.log('tempData: ' + tempData)
          updateKPI(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSuccessfull'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog {
    width:75% !important;
  }
  .editBtn {
    background-color: #e8f4ff;
    border-color: #d1e9ff;
    color: #1890ff;
  }
  .deleteBtn {
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949;
  }
  .runBtn {
    color: #fff;
    background-color: #409167;
    border-color: #409167;
  }
  .scheduleBtn {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
  }
  .detailKPI {
    font-style: italic;
    font-weight: bold;
  }
</style>
