<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-row style="margin-bottom:10px;">
        <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfModels">
          {{ $t('resources.back') }}
        </el-link>
      </el-row>
      <el-input v-model="searchText" :placeholder="$t('models.searchExecution')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button class="filter-item" style="float:right" type="primary" icon="el-icon-plus" @click="createExecution">
        {{ $t('executionsList.addNewExecution') }}
      </el-button>
    </div>
    <el-row style="margin-bottom:30px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('executionsList.noExecutionsAvailable')"
      >
        <el-table-column :label="$t('executionsList.name')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('executionsList.startDate')">
          <template slot-scope="{row}">
            <span>{{ convertDate(row.start) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('executionsList.status')" align="center">
          <template slot-scope="{row}">
            <span>{{ textMapForStatus[row.otStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('executionsList.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <span style="padding-left:20px" />
            <el-button size="small" class="viewBtn" @click="viewJSON(row)">
              <i class="el-icon-view">
                {{ $t('executionsList.viewResult') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <!--<router-link v-if="$route.name.includes('Model')" :to="{name:'opToolsView', params: {modelId: refId, executionId: row.id, type: row.type}}">
              <el-button size="small" class="viewBtn">
                <i class="el-icon-view">
                  {{ $t('executionsList.viewResult') }}
                </i>
              </el-button>
            </router-link>-->
            <router-link v-if="$route.name.includes('Predictive Algorithm')" :to="{name:'opToolsView', params: {id: refId, executionId: row.id}}">
              <el-button size="small" class="viewBtn">
                <i class="el-icon-view">
                  {{ $t('executionsList.viewResult') }}
                </i>
              </el-button>
            </router-link>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" :disabled="row.otStatus=='running'" @click="deleteExecution(row.id)">
              <i class="el-icon-delete-solid">
                {{ $t('models.deleteModel') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getExecutionList" />

    <el-dialog :title="executionTitle" :visible.sync="executionDialog" width="80%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.name')" prop="name">
              <el-input ref="name" v-model="dataForm.name" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('models.idRef')">
              <el-input v-model="dataForm.idRef" :disabled="true" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.description')" prop="description">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="dataForm.input.length > 0">
          <el-collapse v-model="activeInput" @change="handleChangeInput">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.input') }}</h3>
              </template>
              <div v-for="(item,indexInput) in dataForm.input" :key="indexInput">
                <el-collapse v-model="activeInputSection" accordion @change="handleChangeInputSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <el-form-item
                        v-if="option.required"
                        :label-width="labelFirstColumn"
                        :label="option.name"
                        :prop="'input.' + indexInput + '.options.' + index + '.value'"
                        :rules="{ required: true, pattern: option.pattern, message: option.name + requiredText, trigger: 'blur' }"
                      >
                        <el-input v-model="dataForm.input[indexInput].options[index].value" style="width:95%" />
                      </el-form-item>
                      <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">

                        <el-input v-model="dataForm.input[indexInput].options[index].value" style="width:95%" />
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-if="dataForm.output.length > 0">
          <el-collapse v-model="activeOutput" @change="handleChangeOutput">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.output') }}</h3>
              </template>
              <div v-for="(item,indexOutput) in dataForm.output" :key="indexOutput">
                <el-collapse v-model="activeOutputSection" accordion @change="handleChangeOutputSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <el-form-item
                        v-if="option.required"
                        :label-width="labelFirstColumn"
                        :label="option.name"
                        :prop="'output.' + indexOutput + '.options.' + index + '.value'"
                        :rules="{ required: true, pattern: option.pattern, message: option.name + requiredText, trigger: 'blur' }"
                      >
                        <el-input v-model="dataForm.output[indexOutput].options[index].value" style="width:95%" />
                      </el-form-item>
                      <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">
                        <el-input v-model="dataForm.output[indexOutput].options[index].value" style="width:95%" />
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-if="dataForm.logging.length > 0">
          <el-collapse v-model="activeLogging" @change="handleChangeLogging">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.logging') }}</h3>
              </template>
              <div v-for="(item,indexLogging) in dataForm.logging" :key="indexLogging">
                <el-collapse v-model="activeLoggingSection" accordion @change="handleChangeLoggingSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <el-form-item
                        v-if="option.required"
                        :label-width="labelFirstColumn"
                        :label="option.name"
                        :prop="'logging.' + indexLogging + '.options.' + index + '.value'"
                        :rules="{ required: true, pattern: option.pattern, message: option.name + requiredText, trigger: 'blur' }"
                      >
                        <el-input v-model="dataForm.logging[indexLogging].options[index].value" style="width:95%" />
                      </el-form-item>
                      <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">
                        <el-input v-model="dataForm.logging[indexLogging].options[index].value" style="width:95%" />
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeDialog()">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="executionTitle===$t('models.createExecution')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- DIALOG TO SHOW THE JSON FILE -->
    <el-dialog :visible.sync="viewResultDialog" :title="$t('scheduledExecutionsList.viewExecution')">
      <el-card class="box-card">
        <json-editor ref="jsonEditor" v-model="result" :disabled="true" />
        <!--<el-input v-model="result" :autosize="{ minRows: 3, maxRows: 20}" type="textarea" style="width:95%" />-->
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="viewResultDialog = false">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>
    <div class="filter-container" style="margin-top:10px;">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfModels">{{ $t('resources.back') }}</el-link>
    </div>
  </div>
</template>

<script>

import JsonEditor from '@/components/JsonEditor'
import { getInstancesByIdRef, addInstance, updateInstance, removeInstance, getModel } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on

// import pixelCommon from '@/utils/common'
import pixelConstants from '@/utils/constants' // import class for constants

export default {
  name: 'ExecutionList',
  components: { JsonEditor, Pagination },
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
      validateUrl: '/(http(s)?://.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/',
      requiredText: '',
      activeInput: ['0'], // id del elemento activo. 0 para colapsado
      activeOutput: ['0'],
      activeLogging: ['0'],
      activeInputSection: ['0'],
      activeOutputSection: ['0'],
      activeLoggingSection: ['0'],
      result: null,
      viewResultDialog: false,
      searchText: '',
      modelRef: {},
      executionsList: [],
      listLoading: true,
      executionDialog: false,
      executionTitle: '',
      initialDataForm: {},
      resetData: {
        idRef: '',
        name: '',
        description: '',
        mode: '',
        user: '',
        input: [],
        forceinput: [],
        output: [],
        logging: [],
        creation: null,
        start: null,
        // otStatus: null,
        dockerId: ''
      },
      dataForm: {
        idRef: '',
        name: '',
        description: '',
        mode: '',
        user: '',
        input: [],
        forceinput: [],
        output: [],
        logging: [],
        creation: null,
        start: null,
        // otStatus: null,
        dockerId: ''
      },
      inputs: pixelConstants.inputsExecution,
      inputsOperation: pixelConstants.inputsOperation,
      inputTypesEndPoint: pixelConstants.inputsExecutionType,
      inputType: null,
      labelFirstColumn: '115px',
      labelSecondColumn: '75px',
      rules: {
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('models.errDescriptionRequired'), trigger: 'blur' }]
      },
      total: 0,
      listQuery: {
        id: undefined,
        page: 1,
        limit: 5,
        refId: undefined
      },
      textMapForStatus: {
        deleted: this.$t('models.deleted'),
        running: this.$t('models.running'),
        error: this.$t('models.error'),
        success: this.$t('models.success'),
        created: this.$t('models.created'),
        deployed: this.$t('models.deployed'),
        finished: this.$t('models.finished')
      },
      fileContent: ''
    }
  },
  computed: {
    refId() {
      // console.log(this.$route.params.id)
      var id = this.$route.params.id
      this.obtainRow(id)
      return id
    },
    filteredBySearchText() {
      return this.executionsList.filter(execution => execution.name.toLowerCase().includes(this.searchText.toLowerCase()))
      // || model.dockerInfo.label.toLowerCase().includes(this.searchText.toLowerCase())
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
  watch: {
    lang() {
      this.commonTranslation()
    }
  },
  created() {
    this.getExecutionList()
    this.commonTranslation()
  },
  methods: {
    commonTranslation() {
      this.requiredText = this.$t('common.requiredText')
    },
    closeDialog() {
      this.dataForm = this.resetData
      this.buildDataForm()
      this.initializeCollapseObject()
      this.executionDialog = false
    },
    handleChangeLogging(val) {
      console.log(val)
    },
    handleChangeOutput(val) {
      console.log(val)
    },
    handleChangeInput(val) {
      console.log(val)
    },
    handleChangeInputSection(val) {
      console.log(val)
    },
    handleChangeOutputSection(val) {
      console.log(val)
    },
    handleChangeLoggingSection(val) {
      console.log(val)
    },
    initializeCollapseObject() {
      this.activeInput = ['0']
      this.activeOutput = ['0']
      this.activeLogging = ['0']
      this.activeInputSection = ['0']
      this.activeOutputSection = ['0']
      this.activeLoggingSection = ['0']
    },
    obtainRow(id) {
      this.listQuery.id = id
      getModel(this.listQuery).then(response => {
        this.modelRef = response
        this.buildDataForm()
      })
    },
    buildDataForm() {
      console.log(' BUILDDATAFORM')
      console.log(this.modelRef)
      this.initialDataForm = this.dataForm
      this.initialDataForm.idRef = this.modelRef.id
      if (this.modelRef.generalInfo.supportExecSync) {
        this.initialDataForm.mode = 'ExecSync'
      } else {
        this.initialDataForm.mode = 'ExecAsync'
      }
      this.initialDataForm.user = null
      // Start input section
      this.modelRef.generalInfo.input.forEach(input => {
        var itemInput = {
          'name': input.name,
          'category': input.supportedConnectors[0],
          'type': input.type,
          'description': input.description,
          'metadata': {
            'usage': input.metadata.usage
          },
          'options': []
        }
        this.initialDataForm.input.push(itemInput)
        var connectors = this.AddElementConnectors(input.supportedConnectors[0])
        connectors.forEach(conn => {
          itemInput.options.push(conn)
        })
        input.options.forEach(options => {
          var itemOption = {
            'name': options.name,
            'type': options.type,
            'description': options.description,
            'required': options.required,
            // 'pattern': options.pattern,
            'value': ''
          }
          itemInput.options.push(itemOption)
        })
      })
      // End input section
      // Start output section
      this.modelRef.generalInfo.output.forEach(output => {
        var itemOutput = {
          'name': output.name,
          'category': output.supportedConnectors[0],
          'type': output.type,
          'description': output.description,
          'metadata': {
            'usage': output.metadata.usage
          },
          'options': []
        }
        this.initialDataForm.output.push(itemOutput)
        var connectors = this.AddElementConnectors(output.supportedConnectors[0])
        connectors.forEach(conn => {
          itemOutput.options.push(conn)
        })
        output.options.forEach(options => {
          var itemOption = {
            'name': options.name,
            'type': options.type,
            'description': options.description,
            'required': options.required,
            // 'pattern': options.pattern,
            'value': ''
          }
          itemOutput.options.push(itemOption)
        })
      })
      // End output section
      // Start logging section
      this.modelRef.generalInfo.logging.forEach(logging => {
        var itemLogging = {
          'name': logging.name,
          'category': logging.supportedConnectors[0],
          'type': logging.type,
          'description': logging.description,
          'metadata': {
            'usage': logging.metadata.usage
          },
          'options': []
        }
        this.initialDataForm.logging.push(itemLogging)
        var connectors = this.AddElementConnectors(logging.supportedConnectors[0])
        connectors.forEach(conn => {
          itemLogging.options.push(conn)
        })
        logging.options.forEach(options => {
          var itemOption = {
            'name': options.name,
            'type': options.type,
            'description': options.description,
            'required': options.required,
            // 'pattern': options.pattern,
            'value': ''
          }
          itemLogging.options.push(itemOption)
        })
      })
      // End logging section
      this.initialDataForm.creation = 0
      this.initialDataForm.start = 0
      // this.initialDataForm.otStatus = ''
      this.initialDataForm.dockerId = ''
      this.dataForm = this.initialDataForm
      console.log('current dataform')
      console.log(this.dataForm)
    },
    AddElementConnectors(itemConnector) {
      var connectors = []
      this.modelRef.generalInfo.system.connectors.forEach(connector => {
        if (connector.type === itemConnector) {
          connector.options.forEach(option => {
            var item = {
              'name': option.name,
              'type': option.type,
              'description': option.description,
              'required': option.required,
              'value': ''
            }
            connectors.push(item)
          })
        }
      })
      return connectors
    },
    gotoListOfModels() {
      this.$router.push({ name: 'models' })
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    viewJSON(row) {
      this.viewResultDialog = true
      this.result = row
    },
    editInstance(row) {
      this.dataForm = Object.assign({}, row) // copy object
      this.executionTitle = this.$t('models.editExecution')
      this.executionDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      const file = files[0]
      // console.log(file)
      // console.log(file.name.split('.').pop())
      var extension = file.name.split('.').pop()
      if (extension === 'json') {
        const reader = new FileReader()

        reader.onload = e => {
          this.fileContent = e.target.result
          // console.log(JSON.parse(this.fileContent))
          // this.showEditModel(JSON.parse(this.fileContent))
          this.LoadEditExecution(JSON.parse(this.fileContent))
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.checkBeforeToConfirm')
          })
        }
        reader.readAsText(file)
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.FileNotAllowed')
        })
      }
    },
    handleFilter() {

    },
    getExecutionList() {
      this.listQuery.refId = this.refId
      this.listLoading = true
      getInstancesByIdRef(this.listQuery).then(response => {
        console.log(response)
        this.executionsList = response
        this.links = this.executionsList
        this.total = this.executionsList.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    deleteExecution(idExecution) {
      this.listQuery.id = idExecution
      this.$confirm(this.$t('common.removeExecutionModel'), this.$t('common.deleteExecutionModel'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await removeInstance(this.listQuery)
        this.getExecutionList()
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
      this.dataForm = this.initialDataForm
    },
    createExecution() {
      // this.inputType = null
      this.resetdataForm()
      /* if (this.$route.name.includes('Model')) {
        this.dataForm.type = 'model'
      } else {
        this.dataForm.type = 'pa'
      }*/
      this.executionTitle = this.$t('models.createExecution')
      this.executionDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.name.focus()// Put focus over the first input control
      })
    },
    convertNumber() {
      this.dataForm.input.forEach(input => {
        input.options.forEach(option => {
          if (option.type !== 'string' && option.type !== 'headersObject' && option.value !== '') {
            option.value = parseInt(option.value)
          } else if (option.type !== 'string' && option.type !== 'headersObject' && option.value === '') {
            option.value = parseInt(0)
          }
        })
      })
    },
    convertHeaders() {
      this.dataForm.input.forEach(input => {
        input.options.forEach(option => {
          if (option.name === 'headers' && option.value !== '') {
            var headers = option.value
            var header = []
            if (option.value.includes(';')) {
              // console.log('hay más de uno')
              var res = headers.split(';')
              res.forEach(items => {
                var item = items.split(':')
                var element = {
                  'key': item[0],
                  'value': item[1]
                }
                header.push(element)
              })
              // console.log(header)
            } else {
              // console.log('Solo hay un elemento')
              var item = headers.split(':')
              var element = {
                'key': item[0],
                'value': item[1]
              }
              header.push(element)
              // console.log(header)
            }
            console.log(header)
            option.value = header
          }
        })
      })
    },
    deleteRequired() {
      this.dataForm.input.forEach(input => {
        input.options.forEach(option => {
          delete option['required']
        })
      })
      this.dataForm.output.forEach(output => {
        output.options.forEach(option => {
          delete option['required']
        })
      })
      this.dataForm.logging.forEach(logging => {
        logging.options.forEach(option => {
          delete option['required']
        })
      })
    },
    createData(formName) {
      // console.log(this.dataForm)
      this.$refs[formName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.convertNumber()
          // this.convertHeaders()
          this.deleteRequired()
          console.log('Instance')
          console.log(this.dataForm)
          addInstance(this.dataForm).then(response => {
            this.executionDialog = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getExecutionList()
            this.dataForm = this.resetData
            this.buildDataForm()
            this.initializeCollapseObject()
          }).catch(error => {
            console.log('Error instancia: ' + error.response.data)
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        } else {
          // Review the mandatory fields in the different sections!!
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            message: this.$t('common.reviewMandatoryFields')
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          console.log(tempData)
          updateInstance(tempData).then(response => {
            this.executionDialog = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSuccessfull'),
              type: 'success',
              duration: 2000
            })
            this.getExecutionList()
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
    convertDate(inputFormat) {
      function pad(s) {
        return s < 10 ? '0' + s : s
      }
      var d = new Date(inputFormat)
      return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .viewBtn {
    color: #fff;
    background-color: #9da408;
    border-color: #9da408;
  }
</style>
