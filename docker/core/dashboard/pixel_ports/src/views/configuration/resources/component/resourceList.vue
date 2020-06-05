<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete v-model="nameFiltered" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :placeholder="$t('models.name')" :trigger-on-focus="false" @select="handleSelect" />
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="searchFiltered">
        {{ $t('models.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showResource">
        Add
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>-->
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('area.id')" align="center" :sortable="true" sort-by="name">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('area.label')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creation | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('area.areaType')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastUpdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('area.terminal')" align="center" :sortable="true" sort-by="name">
        <template slot-scope="{row}">
          <span>{{ row.kpiThresholds.lowerThres + " - " + row.kpiThresholds.upperThres }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('area.owner')" align="center" :sortable="true" sort-by="name">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('models.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="$t('kpi.editKPI')" placement="top-start">
            <i class="el-icon-edit" @click="editKPI(row)" />
          </el-tooltip>
          <span style="padding-left:20px" />
          <el-tooltip class="item" effect="dark" :content="$t('kpi.deleteKPI')" placement="top-start">
            <i class="el-icon-error" @click="deleteKPI(row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
    <!-- add / update model el-form  fullscreen-->
    <el-dialog title="Add Area" :visible.sync="dialogArea" width="80%" hide-overlay transition="dialog-bottom-transition">
      <el-form ref="dtFormAreas" :model="dtFormAreas" :rules="rules">
        <el-row align="center">
          <el-col :span="11" style="margin-right:10px;margin-left:50px;">
            <el-form-item :label="$t('area.id')" :label-position="labelPosition" prop="id">
              <el-input v-model="dtFormAreas.id" />
            </el-form-item>
            <el-form-item :label="$t('area.areaType')" :label-position="labelPosition">
              <el-select v-model="dtFormAreas.type" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
                <el-option
                  v-for="item in typeArea"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  multiple
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('area.terminal')" :label-position="labelPosition">
              <el-input v-model="dtFormAreas.terminal" />
            </el-form-item>
          </el-col>
          <el-col :span="11" style="margin-left:10px;">
            <el-form-item :label="$t('area.label')" :label-position="labelPosition">
              <el-input v-model="dtFormAreas.label" />
            </el-form-item>
            <el-form-item :label="$t('area.owner')" :label-position="labelPosition">
              <el-input v-model="dtFormAreas.owner" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success">
          {{ $t('common.confirm') }}
        </el-button>
        <el-button type="danger" @click="dialogArea = false">
          {{ $t('common.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Add Machine" :visible.sync="dialogMachine" width="80%" hide-overlay transition="dialog-bottom-transition">
      <el-form ref="dtFormMachines" :model="dtFormMachines" :rules="rules">
        <el-row align="center">
          <el-col :span="11" style="margin-right:10px;margin-left:50px;">
            <el-form-item :label="$t('area.id')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="id">
              <el-input v-model="dtFormMachines.id" />
            </el-form-item>
            <el-form-item :label="$t('area.type')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="type">
              <el-select v-model="dtFormMachines.type" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
                <el-option
                  v-for="item in typeMachine"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  multiple
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('area.owner')" :label-width="labelWidthMachine" :label-position="labelPosition">
              <el-input v-model="dtFormMachines.owner" />
            </el-form-item>
            <el-container>
              <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.throughput') }}</div>
            </el-container>
            <el-container>
              <el-container>
                <el-main>
                  <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="throughput.value">
                    <el-input-number v-model.number="dtFormMachines.throughput.value" :min="0" @change="changeThroughput" />
                  </el-form-item>
                  <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="throughput.unit">
                    <el-input v-model="dtFormMachines.throughput.unit" />
                  </el-form-item>
                </el-main>
              </el-container>
            </el-container>

          </el-col>
          <el-col :span="11" style="margin-left:10px;">
            <el-form-item :label="$t('area.label')" :label-width="labelWidthMachine" :label-position="labelPosition">
              <el-input v-model="dtFormMachines.label" />
            </el-form-item>
            <el-form-item :label="$t('area.group')" :label-width="labelWidthMachine" :label-position="labelPosition">
              <el-input v-model="dtFormMachines.group" />
            </el-form-item>
            <el-form-item :label="$t('area.shiftID')" :label-width="labelWidthMachine" :label-position="labelPosition">
              <el-input v-model="dtFormMachines.shiftID" />
            </el-form-item>
            <el-container>
              <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.consumptions') }}</div>
            </el-container>
            <el-container>
              <el-container>
                <el-main>
                  <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.nature')" prop="consumptions.nature">
                    <el-input v-model="dtFormMachines.consumptions.nature" />
                  </el-form-item>
                  <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="consumptions.value">
                    <el-input-number v-model.number="dtFormMachines.consumptions.value" :min="0" @change="changeConsumption" />
                  </el-form-item>
                  <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="consumptions.unit">
                    <el-input v-model="dtFormMachines.consumptions.unit" />
                  </el-form-item>
                </el-main>
              </el-container>
            </el-container>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success">
          {{ $t('common.confirm') }}
        </el-button>
        <el-button type="danger" @click="dialogMachine = false">
          {{ $t('common.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="80%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="8">
            <!--<MDinput v-model="temp.name" :maxlength="90" name="name" required>
              Title
            </MDinput>-->
            <el-form-item :label-width="label1stColumn" :label="$t('models.name')" prop="name">
              <el-input v-model="dataForm.name" :placeholder="$t('kpi.kpiName')" filled outline required style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label2ndColumn" :label="$t('models.category')" prop="category">
              <el-input v-model="textMapForCategory[dataForm.category]" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label3rdColumn" :label="$t('kpi.subcategory')" prop="subcategory">
              <el-input v-model="dataForm.subcategory" :placeholder="$t('kpi.subcategory')" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="8">
            <!--<MDinput v-model="temp.subcategory" :maxlength="100" name="name" required>
              Title
            </MDinput>-->
            <el-form-item :label-width="label1stColumn" :label="$t('kpi.shortDescription')" prop="shortDescription">
              <el-input v-model="dataForm.shortDescription" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" :placeholder="$t('kpi.shortDescription')" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label2ndColumn" :label="$t('kpi.longDescription')" prop="longDescription">
              <el-input v-model="dataForm.longDescription" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" :placeholder="$t('kpi.longDescription')" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label3rdColumn" :label="$t('models.ports')" class="drag-select" prop="ports">
              <el-select v-model="dataForm.ports" :placeholder="$t('models.selectPorts')" multiple style="width:95%">
                <el-option
                  v-for="item in Ports"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  multiple
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="8">
            <el-form-item :label-width="label1stColumn" :label="$t('kpi.serviceUrl')" prop="urls.serviceUrl">
              <el-input v-model="dataForm.urls.serviceUrl" :placeholder="$t('kpi.serviceUrl')" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label2ndColumn" :label="$t('kpi.units')" prop="units">
              <el-input v-model="dataForm.units" :placeholder="$t('kpi.units')" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <h3>{{ $t('kpi.thresholds') }}</h3>
            <el-container>
              <el-row>
                <el-col>
                  <el-form-item :label-width="label3rdColumn" :label="$t('kpi.lowerThreshold')" prop="kpiThresholds.lowerThres">
                    <el-input v-model="dataForm.kpiThresholds.lowerThres" :placeholder="$t('kpi.lowerThreshold')" style="width:95%" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item :label-width="label3rdColumn" :label="$t('kpi.upperThreshold')" prop="kpiThresholds.upperThres">
                    <el-input v-model="dataForm.kpiThresholds.upperThres" :placeholder="$t('kpi.upperThreshold')" style="width:95%" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-container>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="8">
            <el-form-item prop="monitorActive">
              <el-checkbox v-model="dataForm.monitorActive" class="filter-item" style="margin-left:15px;">
                {{ $t('kpi.monitorActive') }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label-width="label2ndColumn" :label="$t('kpi.frequency')" prop="frequency">
              <el-input-number v-model.number="dataForm.frequency" :min="0" style="width:95%" @change="changeFrequency" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogStatus===$t('kpi.createKPI')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getKPIs, getKPI, removeKPI, updateKPI, addKPI } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
// import MDinput from '@/components/MDinput'
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import pixelCommon from '@/utils/common'
import pixelConstants from '@/utils/constants' // import class for constants

const categories = [
  { key: 'energy', display_name: 'Energy', value: 1 },
  { key: 'environmental', display_name: 'Environmental', value: 2 },
  { key: 'traffic', display_name: 'Traffic', value: 3 }
]
// arr to obj, such as { CN : "China", US : "USA" }
const categoriesTypeKeyValue = categories.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'KPIList',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return categoriesTypeKeyValue[type]
    }
  },
  props: {
    category: {
      type: String,
      default: 'environmental'
    }
  },
  data() {
    return {
      list: null,
      valuePorts: '',
      links: [], // need for autocomplete
      nameFiltered: '',
      categoryFiltered: '',
      total: 0,
      listLoading: true,
      listQuery: {
        categorySelected: '',
        page: 1,
        limit: 10,
        id: undefined,
        name: undefined,
        sort: '+id'
      },
      dtFormAreas: {
        id: 'Dock1',
        label: '',
        type: '',
        owner: '',
        terminal: ''
      },
      dtFormMachines: {
        id: '',
        label: '',
        type: '',
        group: '',
        owner: '',
        shiftID: '',
        throughput: {
          value: '',
          unit: ''
        },
        consumptions: {
          nature: '',
          value: '',
          unit: ''
        }
      },
      label1stColumn: '110px',
      label2ndColumn: '110px',
      label3rdColumn: '140px',
      inputDatasources: [],
      textMapForCategory: {
        environmental: this.$t('kpi.categoryEnvironmental'),
        operational: this.$t('kpi.categoryOperational')
      },
      textMapForStatus: {
        deleted: this.$t('models.deleted'),
        running: this.$t('models.running'),
        error: this.$t('models.error'),
        success: this.$t('models.success'),
        created: this.$t('models.created')
      },
      textMapForPorts: {
        'GRSKG': 'Port of Thessaloniki',
        'GRPIR': 'Port of Piraeus',
        'FRBOD': 'Grand Port Maritime of Bordeaux',
        'ITMNF': 'Port of Monfalcone',
        'ITGZA': 'Port of SDAG'
      },
      Ports: [
        { label: 'Port of Thessaloniki', value: 'GRSKG' },
        { label: 'Port of Piraeus', value: 'GRPIR' },
        { label: 'Grand Port Maritime of Bordeaux', value: 'FRBOD' },
        { label: 'Port of Monfalcone', value: 'ITMNF' },
        { label: 'Port of SDAG', value: 'ITGZA' }
      ],
      categories,
      dataForm: {
        name: '',
        category: '',
        subcategory: '',
        shortDescription: '',
        longDescription: '',
        ports: [],
        units: '',
        monitorActive: false,
        frequency: '',
        urls: {
          serviceUrl: ''
        },
        kpiThresholds: {
          lowerThres: '',
          upperThres: ''
        }
      },
      dialogFormVisible: false,
      dialogArea: false,
      dialogMachine: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        category: [{ required: true, message: this.$t('models.errCategoryRequired'), trigger: 'blur' }],
        subcategory: [{ required: true, message: this.$t('kpi.errSubCategoryRequired'), trigger: 'blur' }],
        shortDescription: [{ required: true, message: this.$t('kpi.errShortDescriptionRequired'), trigger: 'blur' }],
        longDescription: [{ required: true, message: this.$t('kpi.errLongDescriptionRequired'), trigger: 'blur' }],
        ports: [{ required: true, message: this.$t('models.errPortRequired'), trigger: 'change' }],
        'urls.serviceUrl': [{ required: true, message: this.$t('kpi.errServiceUrlRequired'), trigger: 'blur' }],
        units: [{ required: true, message: this.$t('kpi.errUnitsRequired'), trigger: 'blur' }],
        'kpiThresholds.lowerThres': [{ required: true, message: this.$t('kpi.errLowerThresRequired'), trigger: 'blur' }],
        'kpiThresholds.upperThres': [{ required: true, message: this.$t('kpi.errUpperThresRequired'), trigger: 'blur' }],
        monitorActive: [{ required: true, message: this.$t('kpi.errmonitorRequired'), trigger: 'change' }],
        frequency: [{ required: true, message: this.$t('kpi.errFrequencyRequired'), trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeFrequency(value) {
      // console.log(value)
    },
    convertFrequency(value) {
      if (Math.floor(value / 60) < 1) {
        return value + ' seconds'
      } else if (Math.floor(value / 3600) < 1) {
        return Math.floor(value / 60) + ' minutes'
      } else if (Math.floor(value / 86400) < 1) {
        return Math.floor(value / 3600) + ' hours'
      } else {
        return Math.floor(value / 86400) + ' days'
      }
    },
    querySearch(queryString, cb) {
      var links = this.links
      var results = queryString ? links.filter(pixelCommon.createFilter(queryString)) : links
      cb(pixelCommon.createRegister(results))
    },
    searchFiltered() {
      this.listQuery.page = 1
      if (this.listQuery.id !== undefined) {
        this.getListFiltered()
        this.nameFiltered = ''
        this.listQuery.id = undefined
      } else {
        this.getList()
        this.nameFiltered = ''
      }
    },
    handleSelect(item) {
      this.listQuery.id = item.id
      this.listQuery.page = 1
      this.getListFiltered()
      this.nameFiltered = ''
      this.listQuery.id = undefined
    },
    getList() {
      this.listLoading = true
      this.listQuery.categorySelected = this.category
      /* getKPIs(this.listQuery).then(response => {
        this.list = response
        this.list[0].value = 42
        this.list[0].lastUpdate = this.list[0].creation
        console.log(this.list)
        this.links = this.list
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }) */
      this.list = null
      this.list.listLoading = false
    },
    getListFiltered() {
      this.listLoading = true
      getKPI(this.listQuery).then(response => {
        var KPIS = []
        KPIS.push(response)
        this.list = KPIS // mapping.mapToModel(response)
        this.links = this.list
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
        name: '',
        category: this.category,
        subcategory: '',
        shortDescription: '',
        longDescription: '',
        ports: [],
        units: '',
        monitorActive: false,
        urls: {
          serviceUrl: ''
        },
        kpiThresholds: {
          lowerThres: '',
          upperThres: ''
        },
        frequency: 0
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
    showResource() {
      console.log(this.category)
      if (this.category === 'area') {
        this.dialogArea = true
      } else {
        this.dialogMachine = true
      }
    },
    editKPI(row) {
      this.dataForm = Object.assign({}, row) // copy object
      // console.log(this.dataForm)
      // this.dataForm.timestamp = new Date(this.dataForm.timestamp)
      this.dialogStatus = this.$t('kpi.editKPI')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getColor(item) {
      if (item.value <= item.kpiThresholds.upperThres && item.value >= (item.kpiThresholds.lowerThres + 10)) {
        return 'greenCircle'
      // }else if(item.value>item.kpiThresholds.lowerThres && item.value<(item.kpiThresholds.lowerThres+10)){
      //     return "yellow";
      } else {
        return 'redCircle'
      }
    },
    createData(formName) {
      // console.log('createData')
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          tempData.lastUpdate = Date.now()
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog {
    width:75% !important;
  }

  .el-icon-edit:hover {
    cursor:hand !important;
  }

  .redCircle {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    padding: 6px;

    background: #fff;
    border: 1px solid #666;
    color: #666;
    text-align: center;
  }

  .greenCircle {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    padding: 6px;

    background: #fff;
    border: 1px solid #666;
    color: #666;
    text-align: center;
  }
  .dotRed {
    height: 25px;
    width: 25px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
  }
  .dotGreen {
    height: 25px;
    width: 25px;
    background-color: green;
    border-radius: 50%;
    display: inline-block;
  }
</style>
