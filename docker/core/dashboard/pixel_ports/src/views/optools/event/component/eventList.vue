<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete v-model="nameFiltered" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :placeholder="$t('models.name')" :trigger-on-focus="false" @select="handleSelect" />
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="searchFiltered">
        {{ $t('models.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createEvent">
        {{ $t('event.addNewRule') }}
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :empty-text="$t('event.emptyRules')"
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
      <el-table-column :label="$t('event.rule')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('event.category')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('event.priority')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('models.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="$t('event.editEvent')" placement="top-start">
            <i class="el-icon-edit" @click="editEvent(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('models.deleteModel')" placement="top-start">
            <i class="el-icon-error" @click="deleteEvent(row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- add / update model el-form  fullscreen-->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="80%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="8">
            <el-form-item label-width="60px" :label="$t('models.name')" prop="name">
              <el-input v-model="dataForm.name" :placeholder="$t('models.modelName')" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('models.category')" prop="category">
              <el-input v-model="textMapForCategory[dataForm.category]" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('event.priority')" prop="priority">
              <el-input v-model="dataForm.priority" :placeholder="$t('event.priority')" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="8">
            <el-form-item label-width="100px" :label="$t('models.description')" prop="description">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :placeholder="$t('models.description')" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus===$t('event.createEvent')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getEvents, getEvent, removeEvent, updateEvent, addEvent } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  name: 'EventList',
  components: { Pagination },
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
      default: 'rules'
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
      inputDatasources: [],
      textMapForCategory: {
        energy: this.$t('models.categoryEnergy'),
        environmental: this.$t('models.categoryEnvironmental'),
        traffic: this.$t('models.categoryTraffic')
      },
      textMapForStatus: {
        deleted: this.$t('models.deleted'),
        running: this.$t('models.running'),
        error: this.$t('models.error'),
        success: this.$t('models.success'),
        created: this.$t('models.created')
      },
      categories,
      dataForm: {
        name: '',
        priority: '',
        category: '',
        description: '',
        action: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        category: [{ required: true, message: this.$t('models.errCategoryRequired'), trigger: 'change' }],
        priority: [{ required: true, message: this.$t('event.errPriorityRequired'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('models.errDescriptionRequired'), trigger: 'blur' }],
        authorModel: [{ required: true, message: this.$t('models.errAuthorRequired'), trigger: 'blur' }],
        portModel: [{ required: true, message: this.$t('models.errPortRequired'), trigger: 'change' }],
        licenseModel: [{ required: true, message: this.$t('models.errLicenseRequired'), trigger: 'blur' }],
        serviceUrlModel: [{ required: true, message: this.$t('models.errServiceUrlRequired'), trigger: 'blur' }],
        dockerImageModel: [{ required: true, message: this.$t('models.errDockerImageRequired'), trigger: 'blur' }],
        dashboardModel: [{ required: true, message: this.$t('models.errDashboardNameRequired'), trigger: 'blur' }],
        inputFormatModel: [{ required: true, message: this.$t('models.errinputFormatRequired'), trigger: 'blur' }],
        outputFormatModel: [{ required: true, message: this.$t('models.erroutputFormatRequired'), trigger: 'blur' }],
        cpuModel: [{ required: true, message: this.$t('models.errCpuRequired'), trigger: 'change' }],
        ramModel: [{ required: true, message: this.$t('models.errRamRequired'), trigger: 'change' }],
        inputDataSourceModel: [{ required: true, message: this.$t('models.errInputDatasourceRequired'), trigger: 'change' }],
        typeModel: [{ required: true, message: this.$t('models.errTypeRequired'), trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.categorySelected = this.category
      getEvents(this.listQuery).then(response => {
        this.list = response
        console.log(this.list)
        this.links = this.list
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getListFiltered() {
      this.listLoading = true
      getEvent(this.listQuery).then(response => {
        var Events = []
        Events.push(response)
        this.list = Events
        this.links = this.list
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    deleteEvent(idEvent) {
      this.listQuery.id = idEvent
      this.$confirm(this.$t('common.removeEvent'), this.$t('common.deleteEvent'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await removeEvent(this.listQuery)
        this.getList()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          updateEvent(tempData).then(response => {
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
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addEvent(this.dataForm).then(response => {
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
    editEvent(row) {
      this.dataForm = Object.assign({}, row) // copy object
      this.dialogStatus = this.$t('event.editEvent')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createEvent() {
      this.resetdataForm()
      this.dialogStatus = this.$t('event.createEvent')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetdataForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        category: this.category,
        priority: '',
        description: '',
        action: ''
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
</style>
