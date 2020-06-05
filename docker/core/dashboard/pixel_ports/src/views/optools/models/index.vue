<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <!--<el-autocomplete v-model="nameFiltered" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :placeholder="$t('models.nameTitle')" :trigger-on-focus="false" @select="handleSelect" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>-->
      <el-input v-if="$route.name === 'models'" v-model="searchText" :placeholder="$t('models.searchModel')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-else v-model="searchText" :placeholder="$t('pAlgorithm.searchPAlgorithm')" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button v-if="$route.name === 'models'" class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="createModel">
        {{ $t('models.addNewModel') }}
      </el-button>
      <el-button v-else class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="createModel">
        {{ $t('pAlgorithm.addNewPAlgorithm') }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:30px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('common.emptyTable')"
      >
        <el-table-column :label="$t('models.dockerName')" align="center" :sortable="true" sort-by="dockerInfo.dockerName">
          <template slot-scope="{row}">
            <span>{{ row.dockerInfo.dockerName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.label')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.dockerInfo.label }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.status')" align="center" width="95">
          <template slot-scope="{row}">
            <span>{{ textMapForStatus[row.otStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.creation')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.creation | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('models.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <router-link v-if="$route.name === 'models'" :to="{name:'Model Execution List', params: {model: row, id: row.id}}">
              <el-button size="small" class="runBtn">
                <i class="el-icon-caret-right">
                  {{ $t('models.runModel') }}
                </i>
              </el-button>
            </router-link>
            <router-link v-else :to="{name:'Predictive Algorithm Execution List', params: {model: row, id: row.id}}">
              <el-button size="small" class="runBtn">
                <i class="el-icon-caret-right">
                  {{ $t('models.runModel') }}
                </i>
              </el-button>
            </router-link>
            <span style="padding-left:10px" />
            <router-link v-if="$route.name === 'models'" :to="{name:'Model Scheduled Executions List', params: {id: row.id}}">
              <el-button size="small" class="scheduleBtn">
                <i class="el-icon-date">
                  {{ $t('models.scheduleModel') }}
                </i>
              </el-button>
            </router-link>
            <router-link v-else :to="{name:'Predictive Algorithm Scheduled Executions List', params: {id: row.id}}">
              <el-button size="small" class="scheduleBtn">
                <i class="el-icon-date">
                  {{ $t('models.scheduleModel') }}
                </i>
              </el-button>
            </router-link>
            <span style="padding-left:10px" />
            <el-button size="small" class="editBtn" @click="editModel(row)">
              <i class="el-icon-edit">
                {{ $t('models.editModel') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" :disabled="row.otStatus=='deleted'" @click="deleteModel(row.id)">
              <i class="el-icon-delete-solid">
                {{ $t('models.deleteModel') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- add / update model el-form  fullscreen-->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-form-item :label-width="labelCol1stColumn" :label="$t('models.dockerName')" prop="dockerInfo.dockerName">
            <el-input ref="name" v-model="dataForm.dockerInfo.dockerName" style="width:100%" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item :label-width="labelCol1stColumn" :label="$t('models.label')" prop="dockerInfo.label">
              <el-input v-model="dataForm.dockerInfo.label" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="monitorActive">
              <el-checkbox v-model="privateRepository" class="filter-item" style="float:right;" @change="IsPrivateRepository">
                {{ $t('models.privateRepository') }}
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="privateRepository">
          <el-row align="center">
            <el-form-item :label-width="labelCol1stColumn" :label="$t('models.URL')" prop="dockerInfo.dockerRepo.url">
              <el-input v-model="dataForm.dockerInfo.dockerRepo.url" style="width:100%" />
            </el-form-item>
          </el-row>
          <el-row align="center">
            <el-form-item :label-width="labelCol1stColumn" :label="$t('models.user')" prop="dockerInfo.dockerRepo.user">
              <el-input v-model="dataForm.dockerInfo.dockerRepo.user" style="width:100%" />
            </el-form-item>
          </el-row>
          <el-row align="center">
            <el-form-item :label-width="labelCol1stColumn" :label="$t('models.password')" prop="dockerInfo.dockerRepo.password">
              <el-input v-model="dataForm.dockerInfo.dockerRepo.password" style="width:100%" show-password :placeholder="$t('common.inputPassword')" />
            </el-form-item>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button v-if="$route.name === 'models'" type="success" @click="dialogStatus===$t('models.createModel')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
        <el-button v-else type="success" @click="dialogStatus===$t('pAlgorithm.createPAlgorithm')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getModelsByType, getModel, removeModel, updateModel, addModel } from '@/api/otools' // getModels
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on
import pixelConstants from '@/utils/constants' // import class for constants
// import { JSONParser } from '@amcharts/amcharts4/core'

const categories = [
  { key: 'energy', display_name: 'Energy', value: 1 },
  { key: 'environmental', display_name: 'Environmental', value: 2 },
  { key: 'traffic', display_name: 'Traffic', value: 3 }
]

export default {
  name: 'ModelsList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      privateRepository: false,
      text: '',
      list: [],
      links: [], // need for autocomplete
      nameFiltered: '',
      categoryFiltered: '',
      total: 0,
      listLoading: true,
      searchText: '',
      listQuery: {
        page: 1,
        limit: 5,
        id: undefined,
        name: undefined,
        sort: '+id'
      },
      labelCol1stColumn: '120px',
      textMapForStatus: {
        deleted: this.$t('models.deleted'),
        running: this.$t('models.running'),
        error: this.$t('models.error'),
        success: this.$t('models.success'),
        created: this.$t('models.created'),
        deployed: this.$t('models.deployed')
      },
      types: pixelConstants.types,
      categories,
      dataForm: {
        generalInfo: {},
        dockerInfo: {
          dockerName: '',
          label: '',
          dockerRepo: {
            url: '',
            user: '',
            password: ''
          }
        },
        otStatus: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        'dockerInfo.dockerName': [{ required: true, message: this.$t('models.errDockerNameRequired'), trigger: 'blur' }],
        'dockerInfo.label': [{ required: true, message: this.$t('models.errLabelRequired'), trigger: 'blur' }],
        'dockerInfo.dockerRepo.url': [{ required: true, message: this.$t('models.errUrlRequired'), trigger: 'blur' }],
        'dockerInfo.dockerRepo.user': [{ required: true, message: this.$t('models.errUsernameRequired'), trigger: 'blur' }],
        'dockerInfo.dockerRepo.password': [{ required: true, message: this.$t('models.errPasswordRequired'), trigger: 'blur' }]
      },
      downloadLoading: false,
      fileContent: ''
    }
  },
  computed: {
    type() {
      var type = ''
      if (this.$route.name.includes('model')) {
        type = pixelConstants.TYPE_MODEL
      } else {
        type = pixelConstants.TYPE_PREDICTIVE_ALGORITHM
      }
      // console.log('type: ' + type)
      return type
    },
    filteredBySearchText() {
      return this.list.filter(model => model.dockerInfo.dockerName.toLowerCase().includes(this.searchText.toLowerCase()) || model.dockerInfo.label.toLowerCase().includes(this.searchText.toLowerCase()))
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
    IsPrivateRepository(val) {
      console.log(val)
    },
    handleSizeChange(val) {
      console.log(`${val} items per page`)
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`)
    },
    querySearch(queryString, cb) {
      var links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links
      cb(this.createRegister(results))
    },
    createFilter(queryString) {
      return (link) => {
        return (link.dockerInfo.dockerName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }, // end createFilter
    createRegister(results) {
      var items = []
      for (var counter = 0; counter <= results.length - 1; counter++) {
        var addItem = {}
        addItem.value = results[counter].dockerInfo.dockerName
        addItem.text = results[counter].dockerInfo.dockerName
        addItem.id = results[counter].id
        items.push(addItem)
      }
      return items
    }, // end createRegister
    handleFilter() {

    },
    handleFilter_old() {
      this.listQuery.page = 1
      if (this.listQuery.id !== undefined) {
        this.getListFiltered()
        this.nameFiltered = ''
        this.listQuery.id = undefined
      } else {
        this.getList()
        this.nameFiltered = ''
        this.categoryFiltered = ''
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
      // console.log(this.type)
      getModelsByType(this.type).then(response => {
      // getModels(this.listQuery).then(response => {
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
      getModel(this.listQuery).then(response => {
        var model = []
        model.push(response)
        this.list = model
        this.links = this.list
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    filterCategory(selectedCategory) {
      if (selectedCategory === '') {
        this.getList()
      } else {
        this.queryCategory(selectedCategory)
      }
    },
    deleteModel(idModel) {
      this.listQuery.id = idModel
      var title = ''
      var subTitle = ''
      if (this.type === pixelConstants.TYPE_MODEL) {
        title = this.$t('common.deleteModel')
        subTitle = this.$t('common.removeModel')
      } else {
        title = this.$t('common.deletePAlgorithm')
        subTitle = this.$t('common.removePAlgorithm')
      }
      this.$confirm(subTitle, title, {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await removeModel(this.listQuery)
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
        generalInfo: {},
        dockerInfo: {
          dockerName: '',
          label: '',
          dockerRepo: {
            url: '',
            user: '',
            password: ''
          }
        },
        otStatus: ''
      }
    },
    createModel() {
      this.resetdataForm()
      this.privateRepository = false
      if (this.type === pixelConstants.TYPE_MODEL) {
        this.dialogStatus = this.$t('models.createModel')
      } else {
        this.dialogStatus = this.$t('pAlgorithm.createPAlgorithm')
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.name.focus()// Put focus over the first input control
      })
    },
    editModel(row) {
      console.log(row)
      this.privateRepository = false
      this.dataForm = Object.assign({}, row) // copy object
      console.log(this.dataForm.dockerInfo.dockerRepo.url)
      if (this.dataForm.dockerInfo.dockerRepo.url !== null && this.dataForm.dockerInfo.dockerRepo.url !== undefined) {
        this.privateRepository = true
      } else {
        this.privateRepository = false
      }
      if (this.type === pixelConstants.TYPE_MODEL) {
        this.dialogStatus = this.$t('models.editModelDialog')
      } else {
        this.dialogStatus = this.$t('pAlgorithm.editPAlgorithmDialog')
      }

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.privateRepository) {
            this.dataForm.dockerInfo.dockerRepo = {}
          }
          // this.dataForm.status = 'deployed'
          addModel(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
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
          if (!this.privateRepository) {
            tempData.dockerInfo.dockerRepo = {}
          }
          updateModel(tempData).then(response => {
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
    handleDelete(row) {
      this.$notify({
        title: this.$t('common.success'),
        message: this.$t('common.deleteSucced'),
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
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
</style>
